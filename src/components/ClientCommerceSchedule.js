import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { HeaderBackButton } from 'react-navigation-stack';
import Schedule from './Schedule';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCourtReservationValueChange,
  onCommerceCourtTypeReservationsRead,
  onCommerceCourtsRead,
  onCommerceCourtTypesRead
} from '../actions';

class ClientCommerceSchedule extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      leftButton: this.renderBackButton()
    });

    this.props.onScheduleRead(this.props.commerce.objectID);
    this.props.onCommerceCourtsRead({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.reservationsOnSlots(this.props.slots);
    }
  }
  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor='white' />
  }

  onBackPress = () => {
    // hace lo mismo que haria si se volviera a montar la pantalla anterior
    this.props.navigation.goBack(null);

    this.props.onCommerceCourtTypesRead({
      commerceId: this.props.commerce.objectID,
      loadingType: 'loading'
    });
  }

  onDateChanged = date => {
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: date });

    this.props.onCommerceCourtTypeReservationsRead({
      commerceId: this.props.commerce.objectID,
      selectedDate: date,
      courtType: this.props.courtType
    });
  }

  onSlotPress = slot => {
    if (slot.available) {
      this.props.onCourtReservationValueChange({
        prop: 'slot',
        value: slot
      });

      this.props.navigation.navigate('commerceCourtsList');
    }
  };

  reservationsOnSlots = slots => {
    const { reservations, courts } = this.props;

    if (reservations.length !== 0) {
      var slots = slots.map(slot => {
        var ocupate = 0;

        reservations.forEach(reservation => {
          slot.startDate.toString() ===
            reservation.startDate.toString()
            ? ocupate++
            : null;
        });

        if (ocupate >= courts.length) {
          return { ...slot, available: false };
        } else {
          return { ...slot, available: true };
        }
      })
    }

    this.props.onScheduleValueChange({ prop: 'slots', value: slots });
  };

  render() {
    const {
      cards,
      selectedDate,
      reservationDayPeriod,
      reservationMinLength,
      onScheduleRead,
      loadingSchedule,
      loadingReservations,
      loadingCourts
    } = this.props;

    return (
      <Schedule
        cards={cards}
        selectedDate={selectedDate}
        reservationMinLength={reservationMinLength}
        reservationDayPeriod={reservationDayPeriod}
        datesWhitelist={[{
          start: moment(),
          end: moment().add(reservationDayPeriod, 'days')
        }]}
        loading={(loadingSchedule || loadingReservations || loadingCourts)}
        onDateChanged={date => this.onDateChanged(date)}
        onRefresh={() => onScheduleRead(this.props.commerce.objectID)}
        onSlotPress={slot => this.onSlotPress(slot)}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    cards,
    selectedDate,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    refreshing
  } = state.scheduleRegister;
  const loadingSchedule = state.scheduleRegister.loading;
  const { commerce, courtType } = state.courtReservation;
  const { reservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { slot } = state.courtReservation;
  const { courts } = state.courtsList;
  const loadingCourts = state.courtsList.loading;

  return {
    commerce,
    cards,
    slots,
    selectedDate,
    reservationDayPeriod,
    reservationMinLength,
    refreshing,
    reservations,
    slot,
    courts,
    courtType,
    loadingSchedule,
    loadingReservations,
    loadingCourts
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleRead,
    onCourtReservationValueChange,
    onCommerceCourtTypeReservationsRead,
    onCommerceCourtsRead,
    onCommerceCourtTypesRead
  }
)(ClientCommerceSchedule);
