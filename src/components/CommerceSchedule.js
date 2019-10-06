import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, Schedule, IconButton } from './common';
import {
  onScheduleRead,
  onScheduleValueChange,
  onCommerceCourtReservationsRead,
  onCourtReservationValueChange,
  onCommerceCourtReservationsReadOnSlot,
  courtsReadOnlyAvailable
} from '../actions';

class CommerceSchedule extends Component {
  state = { modal: false, a: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: moment() });
    this.props.onScheduleRead(this.props.commerceId);
    this.props.onCommerceCourtReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: moment()
    });
    this.props.courtsReadOnlyAvailable(this.props.commerceId);
    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
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

  onDateChanged = async date => {
    await this.props.onScheduleValueChange({
      prop: 'selectedDate',
      value: date
    });
  };

  reservationsOnDay = async slots => {
    this.props.onCommerceCourtReservationsRead({
      commerceId: this.props.commerceId,
      selectedDate: this.props.selectedDate,
      slots: slots,
      courts: this.props.courtsAvailable
    });
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
          reservationsOnDay={slots => this.reservationsOnDay(slots)}
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
