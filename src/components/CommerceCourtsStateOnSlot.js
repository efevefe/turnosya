import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, RefreshControl } from 'react-native';
import { Spinner, EmptyList } from './common';
import {
  courtsReadOnlyAvailable,
  onCommerceCourtReservationsReadOnSlot
} from '../actions';
import CommerceCourtStateListItem from './CommerceCourtStateListItem';
import { MAIN_COLOR } from '../constants';

class CourtListOnSlot extends Component {
  componentWillMount() {
    this.props.onCommerceCourtReservationsReadOnSlot({
      commerceId: this.props.commerceId,
      slot: this.props.slot.startDate
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

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() =>
          this.props.onCommerceCourtReservationsReadOnSlot({
            commerceId: this.props.commerceId,
            slot: this.props.slot.startDate
          })
        }
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  renderList = () => {
    if (this.props.courtsAvailable.length > 0) {
      return (
        <FlatList
          data={this.props.courtsAvailable}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          contentContainerStyle={{ paddingBottom: 95 }}
          refreshControl={this.onRefresh()}
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
  const { courtsAvailable } = state.courtsList;
  const { commerceId } = state.commerceData;
  const { slot } = state.courtReservation;
  const { loading } = state.courtReservationsList;

  return { courtsAvailable, loading, commerceId, slot };
};

export default connect(
  mapStateToProps,
  { courtsReadOnlyAvailable, onCommerceCourtReservationsReadOnSlot }
)(CourtListOnSlot);
