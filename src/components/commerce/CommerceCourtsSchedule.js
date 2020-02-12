import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, IconButton, PermissionsAssigner } from '../common';
import Schedule from '../Schedule';
import { MONTHS } from '../../constants';
import { ROLES } from '../../constants';
import CourtTypesFilter from './CourtTypesFilter';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCommerceReservationsRead,
  onReservationValueChange,
  onCourtsRead,
  isCourtDisabledOnSlot
} from '../../actions';

class CommerceCourtsSchedule extends Component {
  state = { selectedDate: moment(), modal: false, selectedCourtTypes: [] };

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

    this.unsubscribeCourtsRead = this.props.onCourtsRead(this.props.commerceId);

    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations || prevProps.courts !== this.props.courts) {
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
    this.unsubscribeReservationsRead = this.props.onCommerceReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: date
    });

    if (!scheduleId || (scheduleEndDate && date >= scheduleEndDate) || date < scheduleStartDate) {
      this.props.onScheduleRead({
        commerceId: this.props.commerceId,
        selectedDate: date
      });
    }

    this.setState({ selectedDate: date });
  };

  onSlotPress = slot => {
    const { startDate, endDate } = slot;

    this.props.onReservationValueChange({
      startDate,
      endDate
    });

    this.props.navigation.navigate('commerceCourtsList', {
      selectedCourtTypes: this.state.selectedCourtTypes,
      title: startDate.format('DD') + ' de ' + MONTHS[startDate.month()] + ', ' + startDate.format('HH:mm') + ' hs.'
    });
  };

  isCourtTypeSelected = courtType => {
    const { selectedCourtTypes } = this.state;

    return selectedCourtTypes.includes('Todas') || selectedCourtTypes.includes(courtType);
  };

  reservationsOnSlots = () => {
    const { reservations, slots } = this.props;

    // se filtran los courts segun los courtTypes seleccionados
    const courts = this.props.courts.filter(court => {
      return this.isCourtTypeSelected(court.court);
    });

    const newSlots = slots.map(slot => {
      if (slot.divider) return slot;

      let reserved = 0;
      let available = true;
      let courtsAvailable = 0;

      reservations.forEach(reservation => {
        if (
          slot.startDate.toString() === reservation.startDate.toString() &&
          this.isCourtTypeSelected(reservation.courtType)
        )
          reserved++;
      });

      courts.forEach(court => {
        !isCourtDisabledOnSlot(court, slot) && courtsAvailable++;
      });

      if (reserved >= courtsAvailable) available = false;

      return {
        ...slot,
        free: courtsAvailable - reserved,
        total: courts.length,
        available
      };
    });

    this.props.onScheduleValueChange({ slots: newSlots });
  };

  onCourtTypesFilterValueChange = selectedCourtTypes => {
    this.setState({ selectedCourtTypes }, this.reservationsOnSlots);
  };

  renderConfigurationButton = () => {
    return (
      <PermissionsAssigner requiredRole={ROLES.ADMIN}>
        <IconButton icon="md-options" onPress={() => this.setState({ modal: true })} />
      </PermissionsAssigner>
    );
  };

  onScheduleShiftsPress = () => {
    this.setState({ modal: false });
    this.props.navigation.navigate('schedulesList', {
      selectedDate: this.state.selectedDate
    });
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
        <CourtTypesFilter onValueChange={this.onCourtTypesFilterValueChange} />

        <Schedule
          mode="courts"
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
          <MenuItem title="Días y horarios de atención" icon="md-grid" onPress={this.onScheduleShiftsPress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Tiempos de reserva y cancelacion"
            icon="md-timer"
            onPress={this.onScheduleConfigurationPress}
          />
        </Menu>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { id, cards, slots, reservationDayPeriod, reservationMinLength, startDate, endDate } = state.commerceSchedule;
  const loadingSchedule = state.commerceSchedule.loading;
  const { commerceId } = state.commerceData;
  const { reservations } = state.reservationsList;
  const loadingReservations = state.reservationsList.loading;
  const { courts } = state.courtsList;
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
    courts,
    loadingSchedule,
    loadingReservations,
    loadingCourts
  };
};

export default connect(mapStateToProps, {
  onScheduleRead,
  onScheduleValueChange,
  onCommerceReservationsRead,
  onReservationValueChange,
  onCourtsRead
})(CommerceCourtsSchedule);
