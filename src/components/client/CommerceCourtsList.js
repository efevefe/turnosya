import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList, Toast } from '../common';
import CommerceCourtsStateListItem from '../commerce/CommerceCourtsStateListItem';
import { onReservationValueChange, isCourtDisabledOnSlot, onNewReservation } from '../../actions';

class CommerceCourtsList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title'),
  });

  courtReservation = court => {
    const { reservations, startDate } = this.props;

    return reservations.find(reservation => {
      return reservation.startDate.toString() === startDate.toString() && reservation.courtId === court.id;
    });
  };

  onCourtPress = court => {
    this.props.onNewReservation();
    this.props.onReservationValueChange({ court });
    this.props.navigation.navigate('confirmCourtReservation');
  };

  renderRow = ({ item }) => {
    const courtAvailable = !this.courtReservation(item);
    const { startDate, endDate } = this.props;

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerce.objectID}
        navigation={this.props.navigation}
        disabled={isCourtDisabledOnSlot(item, { startDate, endDate })}
        courtAvailable={courtAvailable}
        onPress={() =>
          courtAvailable ? this.onCourtPress(item) : Toast.show({ text: 'Esta cancha ya está reservada' })
        }
      />
    );
  };

  renderList = () => {
    if (this.props.courts.length) {
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
  const { commerce, courtType, startDate, endDate } = state.reservation;
  const { reservations, loading } = state.reservationsList;

  return { commerce, courtType, reservations, courts, loading, startDate, endDate };
};

export default connect(mapStateToProps, { onReservationValueChange, onNewReservation })(CommerceCourtsList);
