import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Spinner, EmptyList } from './common';
import CourtListItem from './CourtListItem';
import {
  courtsReadOnlyAvailable,
  onCommerceCourtReservationsReadOnSlot
} from '../actions';
import { MAIN_COLOR } from '../constants';
import CommerceCourtStateListItem from './CommerceCourtStateListItem';

class CourtListOnSlot extends Component {
  componentWillMount() {
    this.props.onCommerceCourtReservationsReadOnSlot({
      commerceId: this.props.commerceId,
      slot: this.props.slot.startHour
    });
    this.props.courtsReadOnlyAvailable(this.props.commerceId);
  }

  renderRow({ item }) {
    return (
      <CommerceCourtStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

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

    return <EmptyList title="No hay ninguna cancha" />;
  };
  render() {
    if (this.props.loading) return <Spinner />;

    return <View style={{ flex: 1 }}>{this.renderList()}</View>;
  }
}

const mapStateToProps = state => {
  const { courts } = state.courtsList;
  const { commerceId } = state.commerceData;
  const { slot } = state.courtReservation;
  const { reservations, loading } = state.courtReservationsList;

  return { courts, loading, commerceId, slot, reservations };
};

export default connect(
  mapStateToProps,
  { courtsReadOnlyAvailable, onCommerceCourtReservationsReadOnSlot }
)(CourtListOnSlot);
