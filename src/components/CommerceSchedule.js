import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem, IconButton } from './common';
import Schedule from './Schedule';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCommerceCourtReservationsRead,
  onCourtReservationValueChange,
  onCommerceCourtReservationsReadOnSlot,
  courtsReadOnlyAvailable
} from '../actions';

class CommerceSchedule extends Component {
  state = { modal: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.onScheduleRead(this.props.commerceId);
    this.props.courtsReadOnlyAvailable(this.props.commerceId);
    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.reservationsOnSlots(this.props.slots);
    }
  }

  onSlotPress = async slot => {
    this.props.onCourtReservationValueChange({
      prop: 'slot',
      value: slot
    });
    this.props.navigation.navigate('commerceCourtsList');
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

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate('scheduleRegister');
  };

  onScheduleConfigurationPress = () => {
    this.setState({ modal: false });

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate('registerConfiguration');
  };

  onDateChanged = date => {
    this.props.onScheduleValueChange({
      prop: 'selectedDate',
      value: date
    });
    
    this.props.onCommerceCourtReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: date
    });
  };

  reservationsOnSlots = slots => {
    const { reservations, courtsAvailable } = this.props;

    if (reservations.length !== 0) {
      var slots = slots.map(slot => {
        var ocupate = 0;

        reservations.forEach(reservation => {
          slot.startDate.toString() ===
            reservation.startDate.toString()
            ? ocupate++
            : null;
        });

        if (ocupate >= courtsAvailable.length) {
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
      loading,
      onScheduleRead
    } = this.props;
    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Schedule
          cards={cards}
          selectedDate={selectedDate}
          reservationDayPeriod={reservationDayPeriod}
          reservationMinLength={reservationMinLength}
          loading={loading}
          onDateChanged={date => this.onDateChanged(date)}
          onRefresh={() => onScheduleRead(this.props.commerceId)}
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
    cards,
    selectedDate,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    refreshing,
    loading
  } = state.scheduleRegister;
  const { commerceId } = state.commerceData;
  const { reservations } = state.courtReservationsList;
  const { slot } = state.courtReservation;
  const { courtsAvailable } = state.courtsList;

  return {
    cards,
    selectedDate,
    slots,
    reservationDayPeriod,
    reservationMinLength,
    commerceId,
    reservations,
    loading,
    refreshing,
    slot,
    courtsAvailable
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleRead,
    onScheduleValueChange,
    onCommerceCourtReservationsRead,
    onCourtReservationValueChange,
    onCommerceCourtReservationsReadOnSlot,
    courtsReadOnlyAvailable
  }
)(CommerceSchedule);
