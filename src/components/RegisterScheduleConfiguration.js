import React, { Component } from 'react';
import { Card, Slider, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection, Button, Spinner } from './common';
import { MAIN_COLOR } from '../constants';
import { stringFormatDays, stringFormatMinutes } from '../utils';

class RegisterScheduleConfiguration extends Component {
  state = {
    reservationMinFrom: 15,
    reservationMinTo: 240,
    reservationMinValue: 15,
    reservationDayFrom: 1,
    reservationDayTo: 180,
    reservationDayValue: 1
  };

  render() {
    const {
      reservationMinFrom,
      reservationMinTo,
      reservationMinValue,
      reservationDayFrom,
      reservationDayTo,
      reservationDayValue
    } = this.state;

    if (this.props.loading) return <Spinner size="large" />;

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
              onValueChange={newValue =>
                this.setState({ reservationMinValue: newValue })
              }
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
              onValueChange={newValue =>
                this.setState({ reservationDayValue: newValue })
              }
            />
            <Text>
              Límite previo a reservar: {stringFormatDays(reservationDayValue)}
            </Text>
          </CardSection>

          <Divider style={{ marginVertical: 15 }} />

          <CardSection>
            <Button
              title="Guardar"
              loading={this.props.loading}
              // onPress={}
            />
          </CardSection>
        </Card>
      </View>
    );
  }
}

export default RegisterScheduleConfiguration;
