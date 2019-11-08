import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { onScheduleRead } from '../actions';
import { Spinner } from './common';
import Map from './common/Map';
import { DAYS } from '../constants';
import { View } from 'native-base';
import { Card } from 'react-native-elements';

class CommerceProfileInfo extends Component {
  state = { onDay: new Date().getDay() };

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
          id,
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
    const { onDay } = this.state;

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
            style={
              item.id === onDay
                ? {
                    fontSize: 15,
                    fontWeight: 'bold',
                    width: 72
                  }
                : {
                    fontSize: 15,
                    width: 72
                  }
            }
          >
            {item.dayName}
          </Text>
        </View>

        <Text
          style={
            item.id === onDay
              ? { fontSize: 15, fontWeight: 'bold', padding: 5 }
              : { fontSize: 15, padding: 5 }
          }
        >{`${item.firstShiftStart} - ${item.firstShiftEnd}`}</Text>
        {item.secondShiftStart !== null ? (
          <Text
            style={
              item.id === onDay
                ? { fontSize: 15, fontWeight: 'bold', padding: 5 }
                : { fontSize: 15, padding: 5 }
            }
          >{`${item.secondShiftStart} - ${item.secondShiftEnd}`}</Text>
        ) : null}
      </View>
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;
    {
      var hoursOnDay = this.renderSchedule();
    }

    const { address, latitude, longitude } = this.props.locationData;
    const marker = { address, latitude, longitude };
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: '30%' }}>
          <Map marker={marker} draggable={false} />
        </View>
        <Card
          title="Horarios"
          textAlign="center"
          containerStyle={{ borderRadius: 10 }}
        >
          <FlatList
            data={hoursOnDay}
            renderItem={this.renderRow}
            keyExtractor={hourOnDay => hourOnDay.id.toString()}
          />
        </Card>
        <Card
          title="Información de contacto"
          textAlign="center"
          containerStyle={{ borderRadius: 10 }}
        >
          <View style={{ flexDirection: 'column', marginRight: 15 }}>
            <Text
              style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
            >{`E-mail: ${this.props.email}`}</Text>
            <Text
              style={{ textAlign: 'left', fontSize: 15, padding: 5 }}
            >{`Teléfeno: ${this.props.phone}`}</Text>
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
