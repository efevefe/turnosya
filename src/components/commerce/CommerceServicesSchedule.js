import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import Schedule from '../Schedule';
import { Toast, Menu, MenuItem, IconButton, PermissionsAssigner } from '../common';
import { MONTHS, ROLES } from '../../constants';
import EmployeesFilter from './EmployeesFilter';
import {
  onScheduleRead,
  onScheduleValueChange,
  onReservationValueChange,
  onCommerceReservationsRead,
  onNewReservation,
  onServicesRead,
  onEmployeesRead
} from '../../actions';

class CommerceServicesSchedule extends Component {
  state = { selectedDate: moment(), modal: false, selectedEmployeeId: this.props.employeeId };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });

    this.props.onScheduleRead({
      commerceId: this.props.commerceId,
      selectedDate: this.state.selectedDate,
      employeeId: this.state.selectedEmployeeId //
    });

    this.unsubscribeEmployeesRead = this.props.onEmployeesRead(this.props.commerceId);

    this.unsubscribeServicesRead = this.props.onServicesRead(this.props.commerceId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.reservationsOnSlots();
    }
  }

  componentWillUnmount() {
    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeServicesRead && this.unsubscribeServicesRead();
    this.unsubscribeEmployeesRead && this.unsubscribeEmployeesRead();
  }

  onDateChanged = date => {
    const { scheduleStartDate, scheduleEndDate, scheduleId } = this.props;

    this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    this.unsubscribeReservationsRead = this.props.onCommerceReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: date,
      employeeId: this.state.selectedEmployeeId //
    });

    if (!scheduleId || (scheduleEndDate && date >= scheduleEndDate) || date < scheduleStartDate) {
      this.props.onScheduleRead({
        commerceId: this.props.commerceId,
        selectedDate: date,
        employeeId: this.state.selectedEmployeeId //
      });
    }

    this.setState({ selectedDate: date });
  };

  getReservationFromSlot = slot => {
    const reservation = this.props.reservations.find(res => res.startDate.toString() === slot.startDate.toString());

    const service = this.props.services.find(service => service.id === reservation.serviceId);

    return { ...reservation, service };
  };

  onSlotPress = slot => {
    if (!slot.available) {
      return this.props.navigation.navigate('reservationDetails', {
        reservation: this.getReservationFromSlot(slot)
      });
    }

    if (this.props.employeeId !== this.props.selectedEmployeeId) {
      return Toast.show({ text: 'No puedes reservar turnos a nombre de otro empleado' });
    }

    if (moment() >= slot.startDate && slot.available) {
      return Toast.show({
        text: 'Ya no se puede reservar en este horario'
      });
    }

    const startDate = slot.startDate;

    this.props.onReservationValueChange({ startDate });

    this.props.onNewReservation();

    this.props.navigation.navigate('employeeServicesList', {
      title: startDate.format('DD') + ' de ' + MONTHS[startDate.month()] + ', ' + startDate.format('HH:mm') + ' hs.'
    });
  };

  isResFillingSlot = (slot, res) => {
    return slot.startDate.toString() >= res.startDate.toString() && slot.startDate.toString() < res.endDate.toString();
  };

  reservationsOnSlots = () => {
    const { reservations, slots } = this.props;

    const newSlots = slots.map(slot => {
      if (slot.divider) return slot;

      let available = true;
      let visible = true;

      reservations.forEach(reservation => {
        if (this.isResFillingSlot(slot, reservation)) {
          available = false;

          if (slot.startDate.toString() > reservation.startDate.toString()) {
            visible = false;
          }
        }
      });

      return {
        ...slot,
        free: available ? 1 : 0,
        total: 1,
        available,
        visible
      };
    });

    this.props.onScheduleValueChange({ slots: newSlots });
  };

  renderConfigurationButton = () => {
    return <IconButton icon="md-options" onPress={() => this.setState({ modal: true })} />;
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

  onEmployeesFilterValueChange = selectedEmployeeId => {
    if (selectedEmployeeId && selectedEmployeeId !== this.state.selectedEmployeeId) {
      this.setState({ selectedEmployeeId }, () => {
        this.props.onScheduleRead({
          commerceId: this.props.commerceId,
          selectedDate: this.state.selectedDate,
          employeeId: selectedEmployeeId
        });

        this.onDateChanged(this.state.selectedDate);
      });
    }
  }

  render() {
    const {
      cards,
      reservationDayPeriod,
      reservationMinLength,
      loadingSchedule,
      loadingReservations,
      loadingServices
    } = this.props;

    const { selectedDate } = this.state;

    return (
      <View style={{ flex: 1, alignSelf: 'stretch' }}>
        <PermissionsAssigner requiredRole={ROLES.ADMIN}>
          <EmployeesFilter onValueChange={this.onEmployeesFilterValueChange} />
        </PermissionsAssigner>

        <Schedule
          mode="services"
          cards={cards}
          selectedDate={selectedDate}
          reservationMinLength={reservationMinLength}
          reservationDayPeriod={reservationDayPeriod}
          loading={loadingSchedule || loadingReservations || loadingServices}
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
            title="Tiempos de reserva y cancelación"
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
    endDate,
    loading: loadingSchedule
  } = state.commerceSchedule;
  const { commerceId } = state.commerceData;
  const { reservations } = state.reservationsList;
  const loadingReservations = state.reservationsList.loading;
  const { services } = state.servicesList;
  const loadingServices = state.servicesList.loading;
  const { employeeId } = state.roleData;
  const { selectedEmployeeId } = state.employeesList;

  return {
    scheduleId: id,
    cards,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    scheduleStartDate: startDate,
    scheduleEndDate: endDate,
    endDate,
    commerceId,
    employeeId,
    selectedEmployeeId,
    reservations,
    services,
    loadingSchedule,
    loadingReservations,
    loadingServices
  };
};

export default connect(mapStateToProps, {
  onScheduleValueChange,
  onScheduleRead,
  onReservationValueChange,
  onCommerceReservationsRead,
  onNewReservation,
  onServicesRead,
  onEmployeesRead
})(CommerceServicesSchedule);
