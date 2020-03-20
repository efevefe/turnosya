import React, { Component } from 'react';
import { Text, FlatList, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import moment from 'moment';
import { onScheduleRead, onCommerceSchedulesRead } from '../actions';
import { Spinner } from './common';
import { DAYS } from '../constants';

class CommerceProfileInfo extends Component {
  state = { currentDay: new Date().getDay() };

  componentDidMount() {
    this.props.onCommerceSchedulesRead({
      commerceId: this.props.commerceId,
      selectedDate: moment(),
      areaId: this.props.area.areaId
    });
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
          <View key={hourOnDay.day} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: hourOnDay.day === currentDay ? 'bold' : 'normal',
                width: 74
              }}
            >
              {hourOnDay.dayName}
            </Text>
            <Text
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
    if (this.props.loading || this.props.loadingSchedule) return <Spinner />;

    const schedules = this.getFormattedSchedules();

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 15 }}>
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
      </ScrollView>
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
    latitude,
    longitude
  } = state.commerceData;
  const { provincesList } = state.provinceData;
  const { schedules, loading, loadingSchedule } = state.commerceSchedule;

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
    loadingSchedule,
    locationData,
    schedules
  };
};

export default connect(mapStateToProps, { onScheduleRead, onCommerceSchedulesRead })(CommerceProfileInfo);
