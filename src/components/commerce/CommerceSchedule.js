import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, IconButton } from '../common';
import Schedule from '../Schedule';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCommerceCourtReservationsRead,
  onCourtReservationValueChange,
  courtsReadOnlyAvailable
} from '../../actions';

class CommerceSchedule extends Component {
  state = { selectedDate: moment(), modal: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.onScheduleRead({
      commerceId: this.props.commerceId,
      selectedDate: this.state.selectedDate
    });

    this.unsubscribeCourtsRead = this.props.courtsReadOnlyAvailable(this.props.commerceId);

    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations ||
      prevProps.courtsAvailable !== this.props.courtsAvailable) {
      this.reservationsOnSlots();
    }
  }

  componentWillUnmount() {
    this.unsubscribeCourtsRead && this.unsubscribeCourtsRead();
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
  }

  onDateChanged = date => {
    const { scheduleStartDate, scheduleEndDate, scheduleId } = this.props;

    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeReservationsRead = this.props.onCommerceCourtReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: date
    });

    if (!scheduleId || ((scheduleEndDate && date >= scheduleEndDate) || date < scheduleStartDate)) {
      this.props.onScheduleRead({
        commerceId: this.props.commerceId,
        selectedDate: date
      });
    }

    this.setState({ selectedDate: date });
  };

  onSlotPress = slot => {
    this.props.onCourtReservationValueChange({
      prop: 'slot',
      value: slot
    });

    this.props.navigation.navigate('commerceCourtsList');
  };

  reservationsOnSlots = () => {
    const { reservations, courtsAvailable, slots } = this.props;

    const newSlots = slots.map(slot => {
      let reserved = 0;
      let available = true;

      reservations.forEach(reservation => {
        if (slot.startDate.toString() === reservation.startDate.toString())
          reserved++;
      });

      if (reserved >= courtsAvailable.length) available = false;

      return {
        ...slot,
        free: courtsAvailable.length - reserved,
        total: courtsAvailable.length,
        available
      };
    });

    this.props.onScheduleValueChange({ prop: 'slots', value: newSlots });
  };

  renderConfigurationButton = () => {
    return (
      <IconButton
        icon="md-options"
        onPress={() => this.setState({ modal: true })}
      />
    );
  };

  onScheduleShiftsPress = () => {
    this.setState({ modal: false });
    this.props.navigation.navigate('schedulesList', { selectedDate: this.state.selectedDate });
  };

  onScheduleConfigurationPress = () => {
    this.setState({ modal: false });
    this.props.navigation.navigate('registerConfiguration');
  };

  render() {
    const {
      cards,
      reservationDayPeriod,
      reservationMinLength,
      loadingSchedule,
      loadingReservations,
      loadingCourts
    } = this.props;

    const { selectedDate } = this.state;

    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Schedule
          cards={cards}
          selectedDate={selectedDate}
          reservationDayPeriod={reservationDayPeriod}
          reservationMinLength={reservationMinLength}
          loading={loadingSchedule || loadingReservations || loadingCourts}
          onDateChanged={date => this.onDateChanged(date)}
          onSlotPress={slot => this.onSlotPress(slot)}
        />

        <Menu
          title="Configuración de diagramación"
          onBackdropPress={() => this.setState({ modal: false })}
          isVisible={this.state.modal}
        >
          <MenuItem
            title="Días y horarios de atención"
            icon="md-grid"
            onPress={this.onScheduleShiftsPress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Tiempo límite y mínimo de turno"
            icon="md-timer"
            onPress={this.onScheduleConfigurationPress}
          />
        </Menu>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    id,
    cards,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    startDate,
    endDate
  } = state.commerceSchedule;
  const loadingSchedule = state.commerceSchedule.loading;
  const { commerceId } = state.commerceData;
  const { reservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { slot } = state.courtReservation;
  const { courtsAvailable } = state.courtsList;
  const loadingCourts = state.courtsList.loading;

  return {
    scheduleId: id,
    cards,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    scheduleStartDate: startDate,
    scheduleEndDate: endDate,
    commerceId,
    reservations,
    slot,
    courtsAvailable,
    loadingSchedule,
    loadingReservations,
    loadingCourts
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleRead,
    onScheduleValueChange,
    onCommerceCourtReservationsRead,
    onCourtReservationValueChange,
    courtsReadOnlyAvailable
  }
)(CommerceSchedule);
