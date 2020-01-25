import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Slider, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import moment from 'moment';
import { CardSection, Button } from '../common';
import { MAIN_COLOR, MAIN_COLOR_OPACITY } from '../../constants';
import { stringFormatDays, stringFormatHours } from '../../utils';
import {
  onScheduleConfigurationSave,
  onScheduleValueChange
} from '../../actions';

class ScheduleRegisterConfiguration extends Component {
  state = {
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1,
    reservationMinHoursCancelValue: 2
  };

  componentDidMount() {
    const { reservationDayPeriod, reservationMinCancelTime } = this.props;

    this.setState({
      reservationDayValue: reservationDayPeriod,
      reservationMinHoursCancelValue: reservationMinCancelTime
    });
  }

  onSavePressHandler() {
    const {
      reservationDayPeriod,
      reservationMinCancelTime,
      commerceId
    } = this.props;

    this.props.onScheduleConfigurationSave(
      {
        reservationDayPeriod,
        reservationMinCancelTime,
        commerceId,
        date: moment()
      },
      this.props.navigation
    );
  }

  onDaySliderValueChange() {
    this.props.onScheduleValueChange({
      reservationDayPeriod: this.state.reservationDayValue
    });
  }

  onCancelTimeSliderValueChange() {
    this.props.onScheduleValueChange({
      reservationMinCancelTime: this.state.reservationMinHoursCancelValue
    });
  }

  render() {
    const {
      reservationDayFrom,
      reservationDayTo,
      reservationDayValue,
      reservationMinHoursCancelValue
    } = this.state;

    return (
      <View>
        <Card containerStyle={{ borderRadius: 10, paddingBottom: 10 }}>
          <CardSection>
            <Text>
              {'Límite previo a reservar: ' +
                stringFormatDays(reservationDayValue)}
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
          <Divider style={{ marginVertical: 12 }} />
          <CardSection>
            <Text>
              {'Tiempo mínimo de cancelacion del turno: ' +
                stringFormatHours(reservationMinHoursCancelValue)}
            </Text>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR_OPACITY}
              minimumValue={1}
              maximumValue={168}
              step={1}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor={MAIN_COLOR}
              value={reservationMinHoursCancelValue}
              onSlidingComplete={this.onCancelTimeSliderValueChange.bind(this)}
              onValueChange={val =>
                this.setState({ reservationMinHoursCancelValue: val })
              }
            />
          </CardSection>
          <Divider style={{ marginVertical: 12 }} />
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
  const {
    loading,
    reservationDayPeriod,
    reservationMinCancelTime
  } = state.commerceSchedule;

  return {
    commerceId: state.commerceData.commerceId,
    loading,
    reservationDayPeriod,
    reservationMinCancelTime
  };
};

export default connect(mapStateToProps, {
  onScheduleConfigurationSave,
  onScheduleValueChange
})(ScheduleRegisterConfiguration);
