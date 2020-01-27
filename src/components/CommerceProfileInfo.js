import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import moment from 'moment';
import { View } from 'native-base';
import { onScheduleRead, onEmployeesScheduleRead } from '../actions';
import { Spinner } from './common';
import { DAYS } from '../constants';
import { areaFunctionReturn } from '../utils';

class CommerceProfileInfo extends Component {
  state = { currentDay: new Date().getDay() };

  componentDidMount() {
    const scheduleRead = areaFunctionReturn({
      area: this.props.area.areaId,
      sports: () => {
        this.props.onScheduleRead({
          commerceId: this.props.commerceId,
          selectedDate: moment()
        });
      },
      hairdressers: () => {
        this.props.onEmployeesScheduleRead({
          commerceId: this.props.commerceId,
          selectedDate: moment()
        });
      }
    });

    scheduleRead();
  }

  getFormattedSchedules = () => {
    const { schedules } = this.props;

    return schedules.map(schedule => {
      const hoursOnDays = [];

      schedule.cards.forEach(card => {
        const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

        card.days.forEach(day => {
          hoursOnDays.push({
            day,
            dayName: DAYS[day],
            firstShiftStart,
            firstShiftEnd,
            secondShiftStart,
            secondShiftEnd
          });
        });
      });

      return {
        id: schedule.id,
        employeeName: schedule.employeeName || null,
        hoursOnDays: hoursOnDays.sort((a, b) => a.day - b.day)
      };
    });
  };

  renderRow = ({ item }) => {
    const { currentDay } = this.state;
    const { hoursOnDays } = item;

    return (
      <View
        style={{
          padding: 10,
          alignSelf: 'stretch'
        }}
      >
        {item.employeeName ? (
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>{item.employeeName}</Text>
        ) : null}
        {hoursOnDays.map(hourOnDay => (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text
              key={hourOnDay.day}
              style={{
                fontSize: 14,
                fontWeight: hourOnDay.day === currentDay ? 'bold' : 'normal',
                width: 74
              }}
            >
              {hourOnDay.dayName}
            </Text>
            <Text
              key={hourOnDay.day}
              style={{
                fontSize: 14,
                fontWeight: hourOnDay.day === currentDay ? 'bold' : 'normal',
                width: 96
              }}
            >
              {hourOnDay.firstShiftStart + ' - ' + hourOnDay.firstShiftEnd}
            </Text>
            {hourOnDay.secondShiftStart && hourOnDay.secondShiftEnd ? (
              <Text
                key={hourOnDay.day}
                style={{
                  fontSize: 14,
                  fontWeight: hourOnDay.day === currentDay ? 'bold' : 'normal'
                }}
              >
                {hourOnDay.secondShiftStart + ' - ' + hourOnDay.secondShiftEnd}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

    const schedules = this.getFormattedSchedules();

    return (
      <View style={{ flex: 1 }}>
        <Card
          title="Horarios"
          textAlign="center"
          containerStyle={{ borderRadius: 10 }}
          dividerStyle={{ marginBottom: 8 }}
        >
          <FlatList data={schedules} renderItem={this.renderRow} keyExtractor={schedule => schedule.id} />
        </Card>
        <Card title="Información de Contacto" textAlign="center" containerStyle={{ borderRadius: 10 }}>
          <View style={{ flexDirection: 'column', marginRight: 15 }}>
            <Text style={{ textAlign: 'left', fontSize: 15, padding: 5 }}>{`E-mail: ${this.props.email}`}</Text>
            <Text style={{ textAlign: 'left', fontSize: 15, padding: 5 }}>{`Teléfono: ${this.props.phone}`}</Text>
          </View>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    name,
    cuit,
    email,
    phone,
    description,
    address,
    city,
    province,
    area,
    areasList,
    profilePicture,
    commerceId,
    refreshing,
    latitude,
    longitude
  } = state.commerceData;
  const { provincesList } = state.provinceData;
  const { schedules, loading } = state.commerceSchedule;

  let locationData = { ...state.locationData };

  if (!locationData.country) {
    locationData = {
      ...state.locationData,
      address,
      city,
      provinceName: province.name,
      latitude,
      longitude,
      country: 'Argentina'
    };
  }

  return {
    name,
    cuit,
    email,
    phone,
    description,
    province,
    provincesList,
    area,
    areasList,
    profilePicture,
    commerceId,
    loading,
    refreshing,
    locationData,
    schedules
  };
};

export default connect(mapStateToProps, { onScheduleRead, onEmployeesScheduleRead })(CommerceProfileInfo);
