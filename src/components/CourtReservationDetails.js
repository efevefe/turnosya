import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Avatar, Icon } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from './common';
import { MONTHS, DAYS, MAIN_COLOR } from '../constants';

class CourtReservationDetails extends Component {
  state = { name: '', profilePicture: '' };

  componentDidMount() {
    const { commerce, client } = this.props;

    if (commerce) {
      this.setState({
        name: commerce.name,
        profilePicture: commerce.profilePicture
      });
    } else {
      this.setState({
        name: `${client.firstName} ${client.lastName}`,
        profilePicture: client.profilePicture
      });
    }
  }

  /*
    Esto queda comentado por ahora ya que la propiedad provinceName se llama asi cuando el commerce viene desde Algolia
    pero se llama province.name cuando la consulta viene directo desde la base de datos, entonces habria que solucionar eso

    renderAddress = () => {
        if (this.props.commerce) {
            const { address, city, provinceName } = this.props.commerce;

            return (
                <CardSection style={[styles.cardSections, { paddingBottom: 5, flexDirection: 'row', justifyContent: 'center' }]}>
                    <Icon
                        name="md-pin"
                        type="ionicon"
                        size={16}
                        containerStyle={{ marginRight: 5 }}
                    />
                    <Text style={styles.regularText}>
                        {`${address}, ${city}, ${provinceName}`}
                    </Text>
                </CardSection>
            );
        }
    }
    */

  renderPrice = () => {
    const { price, showPrice } = this.props;

    if (showPrice) {
      return (
        <CardSection style={[styles.cardSections, { marginTop: 15 }]}>
          <Text style={styles.bigText}>{`$${price}`}</Text>
        </CardSection>
      );
    }
  };

  render() {
    const { court, startDate, endDate, light, commerce } = this.props;

    const { name, profilePicture } = this.state;

    return (
      <View style={styles.mainContainer}>
        <Avatar
          rounded
          source={profilePicture ? { uri: profilePicture } : null}
          size={90}
          icon={{ name: commerce ? 'store' : 'person' }}
          containerStyle={styles.avatarStyle}
          onPress={() => {
            if (this.props.client)
              this.props.navigation.navigate('clientProfileView', {
                clientId: this.props.client.id
              });
          }}
        />
        <View style={styles.contentContainer}>
          <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
            <Text style={styles.bigText}>{name}</Text>
          </CardSection>
          {/*this.renderAddress()*/}
          <CardSection
            style={[styles.cardSections, { paddingTop: 8, paddingBottom: 0 }]}
          >
            <Text style={styles.mediumText}>{court.name}</Text>
          </CardSection>
          <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
            <Text style={styles.regularText}>
              {`${court.court} - ${court.ground}`}
            </Text>
          </CardSection>
          <CardSection style={styles.cardSections}>
            <Text style={styles.regularText}>
              {light ? 'Con Luz' : 'Sin Luz'}
            </Text>
          </CardSection>
          <Divider style={styles.divider} />
          <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
            <Text style={styles.regularText}>
              {`${DAYS[moment(startDate).day()]} ${moment(startDate).format(
                'D'
              )} de ${MONTHS[moment(startDate).month()]}`}
            </Text>
          </CardSection>
          <CardSection style={styles.cardSections}>
            <Text style={styles.regularText}>
              {`De ${moment(startDate).format('HH:mm')} hs. a ${moment(
                endDate
              ).format('HH:mm')} hs.`}
            </Text>
          </CardSection>
          {this.renderPrice()}
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
    fontWeight: 'bold'
  },
  mediumText: {
    fontSize: 17
  },
  regularText: {
    fontSize: 14
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

export default CourtReservationDetails;
