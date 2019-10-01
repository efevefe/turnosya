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
  onCommerceCourtReservationsReadOnSlot
} from '../actions';

class CommerceSchedule extends Component {
  state = { modal: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    var today = moment([
      moment().year(),
      moment().month(),
      moment().date(),
      0,
      0
    ]);
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: today });
    this.props.onScheduleRead(this.props.commerceId);

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

  onDateChanged = date => {
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: date });
    // this.props.onCommerceCourtReservationsRead({
    //   commerceId: this.props.commerceId,
    //   selectedDate: date
    // });
  };

  render() {
    const {
      cards,
      selectedDate,
      reservationDayPeriod,
      reservationMinLength,
      loading,
      onScheduleRead,
      reservations
    } = this.props;

    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Schedule
          cards={cards}
          selectedDate={selectedDate}
          reservations={reservations}
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
    reservationDayPeriod,
    reservationMinLength,
    loading,
    refreshing
  } = state.scheduleRegister;
  const { commerceId } = state.commerceData;
  const { reservations } = state.courtReservationsList;
  const { slot } = state.courtReservation;

  return {
    cards,
    selectedDate,
    reservationDayPeriod,
    reservationMinLength,
    commerceId,
    reservations,
    loading,
    refreshing,
    slot
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleRead,
    onScheduleValueChange,
    onCommerceCourtReservationsRead,
    onCourtReservationValueChange,
    onCommerceCourtReservationsReadOnSlot
  }
)(CommerceSchedule);
