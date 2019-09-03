import React, { Component } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, Schedule, IconButton } from './common';
import { onScheduleRead, onScheduleValueChange } from '../actions';

class CommerceSchedule extends Component {
  state = { modal: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.onScheduleRead(this.props.commerceId);
    this.props.onScheduleValueChange({ prop: 'selectedDate', value: moment() });
    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
  }

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
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Schedule
          cards={cards}
          selectedDate={selectedDate}
          reservationDayPeriod={reservationDayPeriod}
          reservationMinLength={reservationMinLength}
          loading={loading}
          onDateChanged={date => onScheduleValueChange({ prop: 'selectedDate', value: date })}
          onRefresh={() => onScheduleRead(this.props.commerceId)}
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

  return {
    cards,
    selectedDate,
    reservationDayPeriod,
    reservationMinLength,
    commerceId,
    loading,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  { onScheduleRead, onScheduleValueChange }
)(CommerceSchedule);
