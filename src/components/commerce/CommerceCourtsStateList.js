import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { Spinner, EmptyList } from '../common';
import {
  onCourtReservationsListValueChange,
  onCourtReservationValueChange,
  isCourtDisabledOnSlot
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

  onReservedCourtPress = async (court, courtReservation) => {
    let reservation = {
      ...courtReservation,
      court: { ...court }
    };

    this.props.navigation.navigate('reservationDetails', {
      reservation
    });
  };

  onAvailableCourtPress = court => {
    this.props.onCourtReservationValueChange({
      prop: 'court',
      value: court
    });

    this.props.navigation.navigate('courtReservationRegister');
  }

  renderRow({ item }) {
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
  const { slot } = state.courtReservation;
  const {
    loading,
    reservations,
    detailedReservations
  } = state.courtReservationsList;

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
  onCourtReservationsListValueChange,
  onCourtReservationValueChange
})(CommerceCourtsStateList);
