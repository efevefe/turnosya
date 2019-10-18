import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Slider, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection, Button, Spinner } from './common';
import { MAIN_COLOR, MAIN_COLOR_OPACITY } from '../constants';
import { stringFormatDays, stringFormatMinutes } from '../utils';
import { onScheduleConfigSave, onScheduleValueChange } from '../actions';

class ScheduleRegisterConfiguration extends Component {
  state = {
    reservationMinFrom: 10,
    reservationMinTo: 240,
    reservationMinValue: 15,
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1
  };

  componentDidMount() {
    const { reservationMinLength, reservationDayPeriod } = this.props;
    this.setState({
      reservationMinValue: reservationMinLength,
      reservationDayValue: reservationDayPeriod
    });
  }

  onSavePressHandler() {
    const { reservationMinLength, reservationDayPeriod, commerceId } = this.props;

    this.props.onScheduleConfigSave({ reservationMinLength, reservationDayPeriod, commerceId }, this.props.navigation);
  }

  onMinSliderValueChange() {
    this.props.onScheduleValueChange({
      prop: 'reservationMinLength',
      value: this.state.reservationMinValue
    });
  }

  onDaySliderValueChange() {
    this.props.onScheduleValueChange({
      prop: 'reservationDayPeriod',
      value: this.state.reservationDayValue
    });
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
        <Card containerStyle={{ borderRadius: 10, paddingBottom: 10 }}>
          <CardSection>
            <Text>
              Duración mínima de turnos:{' '}
              {stringFormatMinutes(reservationMinValue)}
            </Text>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR_OPACITY}
              minimumValue={reservationMinFrom}
              maximumValue={reservationMinTo}
              step={reservationMinFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor={MAIN_COLOR}
              value={reservationMinValue}
              onSlidingComplete={this.onMinSliderValueChange.bind(this)}
              onValueChange={val => this.setState({ reservationMinValue: val })}
            />
          </CardSection>

          <Divider style={{ marginVertical: 15 }} />

          <CardSection>
            <Text>
              Límite previo a reservar: {stringFormatDays(reservationDayValue)}
            </Text>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR_OPACITY}
              minimumValue={reservationDayFrom}
              maximumValue={reservationDayTo}
              step={reservationDayFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor={MAIN_COLOR}
              value={reservationDayValue}
              onSlidingComplete={this.onDaySliderValueChange.bind(this)}
              onValueChange={val => this.setState({ reservationDayValue: val })}
            />
          </CardSection>

          <Divider style={{ marginTop: 15 }} />

          <CardSection>
            <Button
              title="Guardar"
              loading={this.props.loading}
              onPress={this.onSavePressHandler.bind(this)}
              buttonStyle={{ marginLeft: 0, marginRight: 0 }}
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
    loading: state.commerceSchedule.loading,
    reservationMinLength: state.commerceSchedule.reservationMinLength,
    reservationDayPeriod: state.commerceSchedule.reservationDayPeriod
  };
};

export default connect(
  mapStateToProps,
  { onScheduleConfigSave, onScheduleValueChange }
)(ScheduleRegisterConfiguration);
