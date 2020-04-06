import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { CardSection } from './common';
import { MONTHS, DAYS, MAIN_COLOR } from '../constants';

class ServiceReservationDetails extends Component {
  renderName = () => {
    if (this.props.name) {
      return (
        <CardSection style={{ paddingBottom: 0 }}>
          <Text style={styles.bigText}>{this.props.name}</Text>
        </CardSection>
      );
    }
  };

  renderInfo = () => {
    if (this.props.info) {
      return (
        <CardSection style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'center' }}>
          {this.props.infoIcon && (
            <Ionicons name={this.props.infoIcon} size={14} color="black" style={{ marginRight: 5 }} />
          )}
          <Text style={styles.infoText}>{this.props.info}</Text>
        </CardSection>
      );
    }
  };

  renderEmployee = () => {
    const { employee } = this.props;

    if (employee) {
      return (
        <CardSection style={{ padding: 15, paddingTop: 5, paddingBottom: 5 }}>
          <Text style={styles.regularText}>{`Con ${employee.firstName} ${employee.lastName}`}</Text>
        </CardSection>
      );
    }
  };

  setPicturePlaceholder = () => {
    switch (this.props.mode) {
      case 'commerce':
        return { name: 'store' };
      case 'client':
        return { name: 'person' };
      default:
        return {
          name: 'md-calendar',
          type: 'ionicon'
        };
    }
  };

  render() {
    const { picture, service, startDate, endDate } = this.props;

    return (
      <View style={styles.mainContainer}>
        <Avatar
          rounded
          source={picture ? { uri: picture } : null}
          size={90}
          icon={this.setPicturePlaceholder()}
          containerStyle={styles.avatarStyle}
          onPress={this.props.onPicturePress}
        />
        <View style={styles.contentContainer}>
          {this.renderName()}
          {this.renderInfo()}
          <CardSection style={{ paddingTop: 8, paddingBottom: 0 }}>
            <Text style={styles.mediumText}>{service.name}</Text>
          </CardSection>
          {this.renderEmployee()}
          <Divider style={styles.divider} />
          <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
            <Text style={styles.regularText}>
              {DAYS[moment(startDate).day()] +
                ' ' +
                moment(startDate).format('D') +
                ' de ' +
                MONTHS[moment(startDate).month()] +
                ', ' +
                moment(startDate).format('HH:mm') +
                ' hs.'}
            </Text>
          </CardSection>
          <CardSection style={styles.cardSections}>
            <Text style={styles.regularText}>{`Duración: ${endDate.diff(startDate, 'minutes')} min.`}</Text>
          </CardSection>
          <CardSection style={[styles.cardSections, { marginTop: 8 }]}>
            <Text style={styles.bigText}>{`$${this.props.price}`}</Text>
          </CardSection>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarStyle: {
    borderWidth: 3,
    borderColor: MAIN_COLOR,
    margin: 12,
    marginBottom: 8
  },
  contentContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  mediumText: {
    fontSize: 17,
    textAlign: 'center'
  },
  regularText: {
    fontSize: 14,
    textAlign: 'center'
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center'
  },
  divider: {
    margin: 10,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: 'grey'
  },
  cardSections: {
    alignItems: 'center'
  }
});

export default ServiceReservationDetails;
