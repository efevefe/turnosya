import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Spinner, EmptyList } from './common';
import {
  onCommerceCourtReservationsRead,
  onReservationClientRead,
  onCourtReservationsListValueChange
} from '../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';
import CourtReservationDetails from './CourtReservationDetails';

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

  onReservedCourtPress = (court, reservation) => {
    this.setState({ selectedReservation: reservation, selectedCourt: court, detailsVisible: true });

    // aca si la reserva ya esta tambien en la lista detallada, trae el cliente directamente desde ahi
    const res = this.props.detailedReservations.find(res => res.id === reservation.id);
    if (res) return this.props.onCourtReservationsListValueChange({ prop: 'reservationClient', value: res.client });

    this.props.onReservationClientRead(reservation.clientId);
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
    const courtReservation = this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        courtAvailable={!courtReservation}
        onPress={() => !courtReservation ? null : this.onReservedCourtPress(item, courtReservation)}
      />
    );
  }

  renderList = () => {
    if (this.props.courtsAvailable.length > 0) {
      return (
        <FlatList
          data={this.props.courtsAvailable}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          extraData={this.props.reservations}
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
  const {
    loading,
    reservations,
    loadingClientData,
    detailedReservations,
    reservationClient
  } = state.courtReservationsList;

  return {
    courtsAvailable,
    loading,
    commerceId,
    slot,
    reservations,
    detailedReservations,
    loadingClientData,
    reservationClient
  };
};

export default connect(
  mapStateToProps,
  { onCommerceCourtReservationsRead, onReservationClientRead, onCourtReservationsListValueChange }
)(CommerceCourtsStateList);
