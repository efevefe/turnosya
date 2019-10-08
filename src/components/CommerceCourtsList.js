import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList } from './common';
import {
  onCommerceCourtsRead,
  onCourtReservationValueChange,
  onCommerceCourtReservationsReadOnSlot
} from '../actions';
import CommerceCourtStateListItem from './CommerceCourtStateListItem';

class CommerceCourtsList extends Component {
  componentDidMount() {
    this.props.onCommerceCourtReservationsReadOnSlot({
      commerceId: this.props.commerce.objectID,
      startDate: this.props.slot.startDate
    });
    this.props.onCommerceCourtsRead({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });
  }

  onCourtPress = court => {
    this.props.onCourtReservationValueChange({
      prop: 'court',
      value: court
    });

    this.props.navigation.navigate('confirmCourtReservation');
  };

  renderRow = ({ item }) => {
    return (
      <CommerceCourtStateListItem
        court={item}
        commerceId={this.props.commerce.objectID}
        navigation={this.props.navigation}
        onPress={() => this.onCourtPress(item)}
      />
    );
  };

  renderList = () => {
    if (this.props.courts.length > 0) {
      return (
        <FlatList
          data={this.props.courts}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          contentContainerStyle={{ paddingBottom: 95 }}
        />
      );
    }

    return <EmptyList title="No hay canchas disponibles" />;
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return <View style={{ flex: 1 }}>{this.renderList()}</View>;
  }
}

const mapStateToProps = state => {
  const { courts, loading } = state.courtsList;
  const { courtType, slot } = state.courtReservation;
  const { commerce } = state.courtReservation;

  return { commerce, courtType, courts, loading, slot };
};

export default connect(
  mapStateToProps,
  {
    onCommerceCourtsRead,
    onCourtReservationValueChange,
    onCommerceCourtReservationsReadOnSlot
  }
)(CommerceCourtsList);
