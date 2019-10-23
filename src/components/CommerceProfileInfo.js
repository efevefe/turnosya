import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { onScheduleRead } from '../actions';
import { Spinner } from './common';
import { DAYS } from '../constants';
import { View } from 'native-base';
import { Divider } from 'react-native-elements';

class CommerceProfileInfo extends Component {
  componentDidMount() {
    this.props.onScheduleRead(this.props.commerceId);
  }

  renderSchedule = () => {
    const { cards } = this.props;
    const hoursOnDay = [];
    cards.forEach(card => {
      card.days.forEach(day => {
        const firstShiftStart = card.firstShiftStart;
        const firstShiftEnd = card.firstShiftEnd;
        const secondShiftStart = card.secondShiftStart;
        const secondShiftEnd = card.secondShiftEnd;
        const dayName = DAYS[day];
        const id = day;
        hoursOnDay.push({
          id: id,
          dayName,
          firstShiftStart,
          firstShiftEnd,
          secondShiftStart,
          secondShiftEnd
        });
      });
    });
    hoursOnDay.sort((a, b) => a.id - b.id);
    return hoursOnDay;
  };

  renderRow = ({ item }) => {
    console.log(item);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 5
          }}
        >
          <Text
            style={{
              fontSize: 15,
              width: 70
            }}
          >
            {item.dayName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Text
            style={{ fontSize: 15, padding: 5 }}
          >{`${item.firstShiftStart} - ${item.firstShiftEnd}`}</Text>
          {item.secondShiftStart !== null ? (
            <Text
              style={{ fontSize: 15, padding: 5 }}
            >{`${item.secondShiftStart} - ${item.secondShiftEnd}`}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;
    {
      var hoursOnDay = this.renderSchedule();
    }

    return (
      <View>
        <FlatList
          data={hoursOnDay}
          renderItem={this.renderRow}
          keyExtractor={hourOnDay => hourOnDay.id}
        />
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
  const { cards, loading } = state.commerceSchedule;

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
    cards
  };
};

export default connect(
  mapStateToProps,
  { onScheduleRead }
)(CommerceProfileInfo);
