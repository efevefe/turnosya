import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { Spinner, EmptyList } from '../common';
import {
  onReservationValueChange,
  isCourtDisabledOnSlot,
  onNewReservation
} from '../../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';

class CommerceCourtsStateList extends Component {
  state = {
    selectedReservation: {},
    selectedCourt: {}
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title')
  });

  courtReservation = court => {
    const { reservations, slot } = this.props;

    return reservations.find(reservation => {
      return (
        reservation.startDate.toString() === slot.startDate.toString() &&
        reservation.courtId === court.id
      );
    });
  };

  onReservedCourtPress = (court, courtReservation) => {
    let reservation = {
      ...courtReservation,
      court: { ...court }
    };

    this.props.navigation.navigate('reservationDetails', {
      reservation
    });
  };

  onAvailableCourtPress = court => {
    this.props.onNewReservation();
    this.props.onReservationValueChange({ prop: 'court', value: court });
    this.props.navigation.navigate('courtReservationRegister');
  }

  isCourtTypeSelected = courtType => {
    const selectedCourtTypes = this.props.navigation.getParam('selectedCourtTypes');

    return (
      selectedCourtTypes.includes('Todas') ||
      selectedCourtTypes.includes(courtType)
    );
  }

  renderRow({ item }) {
    if (!this.isCourtTypeSelected(item.court)) return;

    const courtReservation = this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
        courtAvailable={!courtReservation}
        disabled={isCourtDisabledOnSlot(item, this.props.slot)}
        onPress={() =>
          !courtReservation
            ? this.onAvailableCourtPress(item)
            : this.onReservedCourtPress(item, courtReservation)
        }
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
          extraData={this.props.reservations}
        />
      );
    }

    return <EmptyList title="No hay ninguna cancha" />;
  };

  render() {
    const { loading } = this.props;
    if (loading) return <Spinner />;

    return this.renderList();
  }
}

const mapStateToProps = state => {
  const { courts } = state.courtsList;
  const { commerceId } = state.commerceData;
  const { slot } = state.reservation;
  const {
    loading,
    reservations,
    detailedReservations
  } = state.reservationsList;

  return {
    courts,
    loading,
    commerceId,
    slot,
    reservations,
    detailedReservations
  };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onNewReservation
})(CommerceCourtsStateList);
