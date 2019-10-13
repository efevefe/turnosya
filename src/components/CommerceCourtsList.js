import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList, Toast } from './common';
import {
  onCourtReservationValueChange,
  onCommerceCourtTypeReservationsRead,
} from '../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';

class CommerceCourtsList extends Component {
  courtReservation = court => {
    const { reservations, slot } = this.props;

    return reservations.find(reservation => {
      return (
        reservation.startDate.toString() === slot.startDate.toString()
        && reservation.courtId === court.id
      );
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
    const courtAvailable = !this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerce.objectID}
        navigation={this.props.navigation}
        courtAvailable={courtAvailable}
        onPress={() => courtAvailable ? this.onCourtPress(item) : Toast.show({ text: 'Esta cancha ya esta reservada' })}
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
          extraData={this.props.reservations}
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
  const { courts } = state.courtsList;
  const { commerce, courtType, slot } = state.courtReservation;
  const { reservations, loading } = state.courtReservationsList;

  return { commerce, courtType, reservations, courts, loading, slot };
};

export default connect(
  mapStateToProps,
  {
    onCourtReservationValueChange,
    onCommerceCourtTypeReservationsRead,
  }
)(CommerceCourtsList);
