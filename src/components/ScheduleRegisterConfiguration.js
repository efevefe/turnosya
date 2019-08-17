import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Slider, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection, Button, Spinner } from './common';
import { MAIN_COLOR } from '../constants';
import { stringFormatDays, stringFormatMinutes } from '../utils';
import { onScheduleConfigSave, onScheduleConfigValueChange } from '../actions';

class ScheduleRegisterConfiguration extends Component {
  state = {
    reservationMinFrom: 15,
    reservationMinTo: 240,
    reservationMinValue: 15,
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1
  };

  onSavePressHandler() {
    this.props.onScheduleConfigSave(
      this.props.reservationMinLength,
      this.props.reservationDayPeriod,
      'aca iria el commerce id' //this.props.commerceId
    );
  }

  onMinSliderValueChange() {
    this.props.onScheduleConfigValueChange(
      'reservationMinLength',
      this.state.reservationMinValue
    );
  }

  onDaySliderValueChange() {
    this.props.onScheduleConfigValueChange(
      'reservationDayPeriod',
      this.state.reservationDayValue
    );
  }

  render() {
    const {
      reservationMinFrom,
      reservationMinTo,
      reservationMinValue,
      reservationDayFrom,
      reservationDayTo,
      reservationDayValue
    } = this.state;

    return (
      <View>
        <Card>
          <CardSection>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR}
              minimumValue={reservationMinFrom}
              maximumValue={reservationMinTo}
              step={reservationMinFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              value={reservationMinValue}
              onSlidingComplete={this.onMinSliderValueChange.bind(this)}
              onValueChange={val => this.setState({ reservationMinValue: val })}
            />
            <Text>
              Duración mínima de turnos:{' '}
              {stringFormatMinutes(reservationMinValue)}
            </Text>
          </CardSection>

          <Divider style={{ marginVertical: 15 }} />

          <CardSection>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR}
              minimumValue={reservationDayFrom}
              maximumValue={reservationDayTo}
              step={reservationDayFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              value={reservationDayValue}
              onSlidingComplete={this.onDaySliderValueChange.bind(this)}
              onValueChange={val => this.setState({ reservationDayValue: val })}
            />
            <Text>
              Límite previo a reservar: {stringFormatDays(reservationDayValue)}
            </Text>
          </CardSection>

          <Divider style={{ marginTop: 15 }} />

          <CardSection>
            <Button
              title="Guardar"
              loading={this.props.loading}
              onPress={this.onSavePressHandler.bind(this)}
            />
          </CardSection>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    commerceId: state.commerceData.commerceId,
    loading: state.scheduleConfig.loading,
    reservationMinLength: state.scheduleConfig.reservationMinLength,
    reservationDayPeriod: state.scheduleConfig.reservationDayPeriod
  };
};

export default connect(
  mapStateToProps,
  { onScheduleConfigSave, onScheduleConfigValueChange }
)(ScheduleRegisterConfiguration);
