import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, RefreshControl } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Spinner, EmptyList } from './common';
import {
  onCourtReservationValueChange,
  onCommerceCourtTypeReservationsRead,
  onScheduleRead
} from '../actions';
import CommerceCourtsStateListItem from './CommerceCourtsStateListItem';
import { MAIN_COLOR } from '../constants';

class CommerceCourtsList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: navigation.getParam('leftButton')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      leftButton: this.renderBackButton()
    });
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor='white' />
  }

  onBackPress = () => {
    this.props.navigation.goBack(null);
    this.props.onScheduleRead(this.props.commerce.objectID);
  }

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
    var courtAvailable = !this.courtReservation(item);

    return (
      <CommerceCourtsStateListItem
        court={item}
        commerceId={this.props.commerce.objectID}
        navigation={this.props.navigation}
        courtAvailable={courtAvailable}
        disabled={!courtAvailable}
        onPress={() => this.onCourtPress(item)}
      />
    );
  };

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => {
          this.props.onCommerceCourtTypeReservationsRead({
            commerceId: this.props.commerce.objectID,
            selectedDate: this.props.selectedDate,
            courtType: this.props.courtType
          });
        }}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
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
          refreshControl={this.onRefresh()}
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
  const { reservations, loading, selectedDate } = state.courtReservationsList;

  return { commerce, courtType, reservations, courts, loading, slot, selectedDate };
};

export default connect(
  mapStateToProps,
  {
    onCourtReservationValueChange,
    onCommerceCourtTypeReservationsRead,
    onScheduleRead
  }
)(CommerceCourtsList);
