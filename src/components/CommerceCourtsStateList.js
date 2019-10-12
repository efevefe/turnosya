import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, RefreshControl } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Spinner, EmptyList } from './common';
import {
  onCommerceCourtReservationsRead,
  onReservationClientRead
} from '../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';
import CourtReservationDetails from './CourtReservationDetails';
import { MAIN_COLOR } from '../constants';

class CommerceCourtsStateList extends Component {
  state = { selectedReservation: {}, selectedCourt: {}, detailsVisible: false };

  courtReservation = court => {
    const { reservations, slot } = this.props;

    return reservations.find(reservation => {
      return (
        reservation.startDate.toString() === slot.startDate.toString()
        && reservation.courtId === court.id
      );
    });
  }

  onReservedCourtPress = async court => {
    await this.setState({ selectedReservation: this.courtReservation(court), selectedCourt: court });
    this.setState({ detailsVisible: true });
    this.props.onReservationClientRead(this.state.selectedReservation.clientId);
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
    var courtAvailable = !this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        courtAvailable={courtAvailable}
        onPress={courtAvailable ? null : () => this.onReservedCourtPress(item)}
      />
    );
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => {
          this.props.onCommerceCourtReservationsRead({
            commerceId: this.props.commerceId,
            selectedDate: this.props.selectedDate
          });
        }}
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
  const { loading, reservations, loadingClientData, reservationClient, selectedDate } = state.courtReservationsList;

  return { courtsAvailable, loading, commerceId, slot, selectedDate, reservations, loadingClientData, reservationClient };
};

export default connect(
  mapStateToProps,
  { onCommerceCourtReservationsRead, onReservationClientRead }
)(CommerceCourtsStateList);
