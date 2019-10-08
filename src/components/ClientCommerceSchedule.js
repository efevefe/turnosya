import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Schedule from './Schedule';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCourtReservationValueChange,
  onCommerceCourtTypeReservationsRead,
  onCommerceCourtsRead
} from '../actions';

class ClientCommerceSchedule extends Component {
  componentDidMount() {
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: moment() });
    this.props.onScheduleRead(this.props.commerce.objectID);
    this.props.onCommerceCourtsRead({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });
  }

  onSlotPress = slot => {
    this.props.onCourtReservationValueChange({
      prop: 'slot',
      value: slot
    });
    if (slot.available) this.props.navigation.navigate('commerceCourtsList');
  };

  reservationsOnDay = slots => {
    this.props.onCommerceCourtTypeReservationsRead({
      commerceId: this.props.commerce.objectID,
      selectedDate: this.props.selectedDate,
      slots: slots,
      courts: this.props.courts,
      courtType: this.props.courtType
    });
  };

  render() {
    const {
      cards,
      selectedDate,
      reservationDayPeriod,
      reservationMinLength,
      loading,
      onScheduleRead,
      onScheduleValueChange
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
        loading={loading}
        onDateChanged={date =>
          onScheduleValueChange({ prop: 'selectedDate', value: date })
        }
        onRefresh={() => onScheduleRead(this.props.commerce.objectID)}
        onSlotPress={slot => this.onSlotPress(slot)}
        getSlots={slots => this.reservationsOnDay(slots)}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    cards,
    selectedDate,
    reservationDayPeriod,
    reservationMinLength,
    loading,
    refreshing
  } = state.scheduleRegister;
  const { commerce, courtType } = state.courtReservation;
  const { reservations } = state.courtReservationsList;
  const { slot } = state.courtReservation;
  const { courts } = state.courtsList;

  return {
    commerce,
    cards,
    selectedDate,
    reservationDayPeriod,
    reservationMinLength,
    loading,
    refreshing,
    reservations,
    slot,
    courts,
    courtType
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleRead,
    onCourtReservationValueChange,
    onCommerceCourtTypeReservationsRead,
    onCommerceCourtsRead
  }
)(ClientCommerceSchedule);
