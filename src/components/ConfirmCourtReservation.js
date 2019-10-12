import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, ButtonGroup, Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { CardSection, Button } from '../components/common';
import { MONTHS, DAYS, MAIN_COLOR } from '../constants';
import { onCourtReservationValueChange } from '../actions';

class ConfirmCourtReservation extends Component {
  state = { selectedIndex: 0, priceButtons: [], prices: [] };

  componentDidMount() {
    this.priceButtons();
  }

  priceButtons = () => {
    const { court } = this.props;
    var priceButtons = [];
    var prices = [];

    if (court) {
      priceButtons.push(`Sin Luz: $${court.price}`);
      prices.push(court.price);

      if (court.lightPrice) {
        priceButtons.push(`Con Luz: $${court.lightPrice}`);
        prices.push(court.lightPrice);
      }
    }

    this.setState({ priceButtons, prices });
  };

  onPriceSelect = selectedIndex => {
    this.setState({ selectedIndex });
    this.props.onCourtReservationValueChange({
      prop: 'price',
      value: this.state.prices[selectedIndex]
    });
  };

  render() {
    const { commerce, court, slot } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {commerce && court && slot ? (
          <View style={{ flex: 1 }}>
            <View style={styles.mainContainer}>
              <Avatar
                rounded
                source={
                  commerce.profilePicture
                    ? { uri: commerce.profilePicture }
                    : null
                }
                size={90}
                icon={{ name: 'store' }}
                containerStyle={styles.avatarStyle}
              />
              <View style={styles.contentContainer}>
                <CardSection
                  style={[styles.cardSections, { paddingBottom: 8 }]}
                >
                  <Text style={styles.commerceName}>{commerce.name}</Text>
                </CardSection>
                <CardSection
                  style={[styles.cardSections, { paddingBottom: 0 }]}
                >
                  <Text style={styles.courtName}>{court.name}</Text>
                </CardSection>
                <CardSection style={styles.cardSections}>
                  <Text style={styles.textStyle}>
                    {`${court.court} - ${court.ground}`}
                  </Text>
                </CardSection>
                <Divider style={styles.divider} />
                <CardSection
                  style={[styles.cardSections, { paddingBottom: 0 }]}
                >
                  <Text style={styles.textStyle}>
                    {`${DAYS[slot.startHour.day()]} ${slot.startHour.format(
                      'D'
                    )} de ${MONTHS[slot.startHour.month()]}`}
                  </Text>
                </CardSection>
                <CardSection style={styles.cardSections}>
                  <Text style={styles.textStyle}>
                    {`De ${slot.startHour.format(
                      'HH:mm'
                    )} hs. a ${slot.endHour.format('HH:mm')} hs.`}
                  </Text>
                </CardSection>
                <CardSection style={styles.cardSections}>
                  <ButtonGroup
                    onPress={this.onPriceSelect}
                    selectedIndex={this.state.selectedIndex}
                    buttons={this.state.priceButtons}
                    containerStyle={styles.priceButtons}
                    selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
                    selectedTextStyle={{ color: 'white' }}
                    textStyle={{ color: 'black' }}
                    innerBorderStyle={{ color: MAIN_COLOR }}
                  />
                </CardSection>
              </View>
              <View style={styles.confirmButtonContainer}>
                <CardSection>
                  <Button title="Confirmar Reserva" />
                </CardSection>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  },
  commerceName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  courtName: {
    fontSize: 17
  },
  textStyle: {
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
  },
  priceButtons: {
    borderColor: MAIN_COLOR,
    height: 60,
    marginTop: 15,
    borderRadius: 8
  },
  confirmButtonContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

const mapStateToProps = state => {
  const { commerce, court, slot, price } = state.courtReservation;

  return { commerce, court, slot, price };
};

export default connect(
  mapStateToProps,
  { onCourtReservationValueChange }
)(ConfirmCourtReservation);
