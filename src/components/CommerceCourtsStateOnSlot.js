import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, RefreshControl } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Spinner, EmptyList } from './common';
import {
  courtsReadOnlyAvailable,
  onCommerceCourtReservationsReadOnSlot,
  onReservationClientRead
} from '../actions';
import CommerceCourtStateListItem from './CommerceCourtStateListItem';
import CourtReservationDetails from './CourtReservationDetails';
import { MAIN_COLOR } from '../constants';

class CommerceCourtsStateOnSlot extends Component {
  state = { selectedReservation: {}, selectedCourt: {}, detailsVisible: false };

  componentDidMount() {
    this.props.onCommerceCourtReservationsReadOnSlot({
      commerceId: this.props.commerceId,
      startDate: this.props.slot.startDate
    });
    this.props.courtsReadOnlyAvailable(this.props.commerceId);
  }

  onReservationPress = async reservation => {
    await this.setState({ selectedReservation: reservation });
    this.setState({ detailsVisible: true });
  }

  onCourtPress = async court => {
    const { reservationsOnSlot } = this.props;
    var reservation = reservationsOnSlot.find(reservation => reservation.courtId === court.id);

    if (reservation) {
      await this.setState({ selectedReservation: reservation, selectedCourt: court });
      this.setState({ detailsVisible: true });
      this.props.onReservationClientRead(reservation.clientId);
    }
  }

  renderDetails = () => {
    if (this.state.detailsVisible) {
      const { startDate, endDate, price, light } = this.state.selectedReservation;
      const { selectedCourt } = this.state;
      const { reservationClient, loadingClientData } = this.props;

      return (
        <Overlay
          isVisible={this.state.detailsVisible}
          onBackdropPress={() => this.setState({ detailsVisible: false })}
          overlayStyle={{ borderRadius: 8, paddingBottom: 25 }}
          height='auto'
          animationType="fade"
        >
          {
            loadingClientData
              ? <Spinner style={{ position: 'relative', padding: 20, paddingTop: 35 }} />
              : (
                <CourtReservationDetails
                  client={reservationClient}
                  court={selectedCourt}
                  startDate={startDate}
                  endDate={endDate}
                  price={price}
                  light={light}
                  showPrice={true}
                />
              )
          }
        </Overlay>
      );
    }
  }

  renderRow({ item }) {
    return (
      <CommerceCourtStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        onPress={() => this.onCourtPress(item)}
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
            startDate: this.props.slot.startDate
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

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}
        {this.renderDetails()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { courtsAvailable } = state.courtsList;
  const { commerceId } = state.commerceData;
  const { slot } = state.courtReservation;
  const { loading, reservationsOnSlot, loadingClientData, reservationClient } = state.courtReservationsList;

  return { courtsAvailable, loading, commerceId, slot, reservationsOnSlot, loadingClientData, reservationClient };
};

export default connect(
  mapStateToProps,
  { courtsReadOnlyAvailable, onCommerceCourtReservationsReadOnSlot, onReservationClientRead }
)(CommerceCourtsStateOnSlot);
