import React, { Component } from 'react';
import { Text } from 'react-native';
import CommerceScheduleReducer from '../reducers/CommerceScheduleReducer';
import { connect } from 'react-redux';
import { onScheduleRead } from '../actions';

class CommerceProfileInfo extends Component {
  componentDidMount() {
    onScheduleRead(this.props.commerceId);
    console.log(this.props.cards);
  }
  render() {
    return <Text>Hola</Text>;
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
    loading,
    refreshing,
    latitude,
    longitude
  } = state.commerceData;
  const { provincesList } = state.provinceData;
  const { cards } = state.commerceSchedule;

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
