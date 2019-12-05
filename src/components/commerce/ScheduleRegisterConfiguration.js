import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Slider, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection, Button } from '../common';
import { MAIN_COLOR, MAIN_COLOR_OPACITY } from '../../constants';
import { stringFormatDays } from '../../utils';
import { onScheduleConfigSave, onScheduleValueChange } from '../../actions';

class ScheduleRegisterConfiguration extends Component {
  state = {
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1
  };

  componentDidMount() {
    const { reservationDayPeriod } = this.props;
    this.setState({
      reservationDayValue: reservationDayPeriod
    });
  }

  onSavePressHandler() {
    const { scheduleId, reservationDayPeriod, commerceId } = this.props;

    // resolucion provisoria hasta que veamos bien donde guardar este valor
    if (scheduleId)
      return this.props.onScheduleConfigSave({ scheduleId, reservationDayPeriod, commerceId }, this.props.navigation);

    this.props.navigation.goBack();
  }

  onDaySliderValueChange() {
    this.props.onScheduleValueChange({
      prop: 'reservationDayPeriod',
      value: this.state.reservationDayValue
    });
  }

  render() {
    const {
      reservationDayFrom,
      reservationDayTo,
      reservationDayValue
    } = this.state;

    return (
      <View>
        <Card containerStyle={{ borderRadius: 10, paddingBottom: 10 }}>
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
    reservationDayPeriod: state.commerceSchedule.reservationDayPeriod,
    scheduleId: state.commerceSchedule.id
  };
};

export default connect(
  mapStateToProps,
  { onScheduleConfigSave, onScheduleValueChange }
)(ScheduleRegisterConfiguration);
