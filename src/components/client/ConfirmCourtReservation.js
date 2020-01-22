import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Button, ButtonGroup } from '../common';
import { MAIN_COLOR, MONTHS, DAYS } from '../../constants';
import {
  onCourtReservationValueChange,
  onClientCourtReservationCreate
} from '../../actions';
import CourtReservationDetails from '../CourtReservationDetails';
import moment from 'moment';

class ConfirmCourtReservation extends Component {
  state = { selectedIndex: 0, priceButtons: [], prices: [] };

  componentDidMount() {
    this.priceButtons();
  }

  priceButtons = () => {
    const { court } = this.props;
    const priceButtons = [];
    const prices = [];

    if (court) {
      priceButtons.push(`Sin Luz: $${court.price}`);
      prices.push(court.price);

      if (court.lightPrice) {
        priceButtons.push(`Con Luz: $${court.lightPrice}`);
        prices.push(court.lightPrice);
      }
    }

    this.setState({ priceButtons, prices }, () => this.onPriceSelect(0));
  };

  onPriceSelect = selectedIndex => {
    this.setState({ selectedIndex });
    this.props.onCourtReservationValueChange({
      price: this.state.prices[selectedIndex],
      light: !!selectedIndex // 0 = false = no light // 1 = true = light
    });
  };

  renderPriceButtons = () => {
    if (!this.props.saved) {
      return (
        <View>
          <CardSection>
            <ButtonGroup
              onPress={this.onPriceSelect}
              selectedIndex={this.state.selectedIndex}
              buttons={this.state.priceButtons}
              textStyle={{ fontSize: 14 }}
            />
          </CardSection>
        </View>
      );
    }
  };

  onConfirmReservation = () => {
    const { commerce, court, courtType, slot, price, light } = this.props;

    const body = `El Turno del día ${
      DAYS[slot.startDate.day()]
    } ${slot.startDate.format('D')} de ${
      MONTHS[moment(slot.startDate).month()]
    } a las ${moment(slot.startDate).format('HH:mm')} fue reservado`;
    const title = 'Turno Reservado';

    notification = { title, body };

    this.props.onClientCourtReservationCreate({
      commerceId: commerce.objectID,
      courtId: court.id,
      courtType,
      slot,
      price,
      light,
      notification
    });
  };

  renderButtons = () => {
    if (this.props.saved) {
      return (
        <CardSection style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flex: 1 }}>
            <RNEButton
              title="Reservar otro"
              type="clear"
              titleStyle={{ color: MAIN_COLOR }}
              icon={
                <Ionicons
                  name="ios-arrow-back"
                  size={30}
                  color={MAIN_COLOR}
                  style={{ marginRight: 10 }}
                />
              }
              onPress={() =>
                this.props.navigation.navigate('commerceProfileView')
              }
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <RNEButton
              title="Finalizar"
              type="clear"
              titleStyle={{ color: MAIN_COLOR }}
              iconRight
              icon={
                <Ionicons
                  name="ios-arrow-forward"
                  size={30}
                  color={MAIN_COLOR}
                  style={{ marginLeft: 10 }}
                />
              }
              onPress={() => this.props.navigation.navigate('commercesAreas')}
            />
          </View>
        </CardSection>
      );
    }

    return (
      <CardSection>
        <Button
          title="Confirmar Reserva"
          loading={this.props.loading}
          onPress={this.onConfirmReservation}
        />
      </CardSection>
    );
  };

  render() {
    const { commerce, court, slot, light, price, saved } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <CourtReservationDetails
          mode="commerce"
          name={commerce.name}
          info={
            commerce.address +
            ', ' +
            commerce.city +
            ', ' +
            commerce.provinceName
          }
          infoIcon="md-pin"
          picture={commerce.profilePicture}
          court={court}
          startDate={slot.startDate}
          endDate={slot.endDate}
          price={price}
          light={light}
          showPrice={saved}
        />
        {this.renderPriceButtons()}
        <View style={styles.confirmButtonContainer}>
          {this.renderButtons()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardSections: {
    alignItems: 'center'
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

const mapStateToProps = state => {
  const {
    commerce,
    courtType,
    court,
    slot,
    price,
    light,
    saved,
    loading
  } = state.courtReservation;
  const { commerceId } = state.commerceData;

  return {
    commerce,
    courtType,
    court,
    slot,
    price,
    light,
    saved,
    loading,
    commerceId
  };
};

export default connect(mapStateToProps, {
  onCourtReservationValueChange,
  onClientCourtReservationCreate
})(ConfirmCourtReservation);
