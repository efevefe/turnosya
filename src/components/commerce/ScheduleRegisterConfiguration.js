import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Slider, Divider } from "react-native-elements";
import { View, Text } from "react-native";
import { CardSection, Button } from "../common";
import { MAIN_COLOR, MAIN_COLOR_OPACITY } from "../../constants";
import {
  stringFormatDays,
  stringFormatMinutes,
  stringFormatHours
} from "../../utils";
import { onScheduleConfigSave, onScheduleValueChange } from "../../actions";

class ScheduleRegisterConfiguration extends Component {
  state = {
    reservationMinFrom: 10,
    reservationMinTo: 240,
    reservationMinValue: 15,
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1,
    reservationMinHoursCancelValue: 2,
  };

  componentDidMount() {
    const {
      reservationMinLength,
      reservationDayPeriod,
      reservationMinCancelTime
    } = this.props;
    this.setState({
      reservationMinValue: reservationMinLength,
      reservationDayValue: reservationDayPeriod,
      reservationMinHoursCancelValue: reservationMinCancelTime
    });
  }

  onSavePressHandler() {
    const {
      reservationMinLength,
      reservationDayPeriod,
      commerceId,
      reservationMinCancelTime
    } = this.props;

    this.props.onScheduleConfigSave(
      {
        reservationMinLength,
        reservationDayPeriod,
        reservationMinCancelTime,
        commerceId
      },
      this.props.navigation
    );
  }

  onMinSliderValueChange() {
    this.props.onScheduleValueChange({
      prop: "reservationMinLength",
      value: this.state.reservationMinValue
    });
  }

  onDaySliderValueChange() {
    this.props.onScheduleValueChange({
      prop: "reservationDayPeriod",
      value: this.state.reservationDayValue
    });
  }

  onHoursSliderValueChange() {
    this.props.onScheduleValueChange({
      prop: "reservationMinCancelTime",
      value: this.state.reservationMinHoursCancelValue
    });
  }

  render() {
    const {
      reservationMinFrom,
      reservationMinTo,
      reservationMinValue,
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
              Duración mínima de turnos:{" "}
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
            <Text>
              Tiempo mínimo de cancelacion del turno:{" "}
              {stringFormatHours(reservationMinHoursCancelValue)}
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
              onSlidingComplete={this.onHoursSliderValueChange.bind(this)}
              onValueChange={val => this.setState({ reservationMinHoursCancelValue: val })}
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
    reservationDayPeriod: state.commerceSchedule.reservationDayPeriod,
    reservationMinCancelTime: state.commerceSchedule.reservationMinCancelTime
  };
};

export default connect(
  mapStateToProps,
  { onScheduleConfigSave, onScheduleValueChange }
)(ScheduleRegisterConfiguration);
