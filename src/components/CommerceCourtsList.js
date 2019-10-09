import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { Spinner, EmptyList } from './common';
import {
  onCommerceCourtsReadByType,
  onCourtReservationValueChange,
  onCommerceCourtReservationsReadOnSlot,
  onCommerceCourtTypeReservationsRead,
  onScheduleRead
} from '../actions';
import CommerceCourtStateListItem from './CommerceCourtStateListItem';

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

    this.props.onCommerceCourtReservationsReadOnSlot({
      commerceId: this.props.commerce.objectID,
      startDate: this.props.slot.startDate
    });

    this.props.onCommerceCourtsReadByType({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor='white' />
  }

  onBackPress = () => {
    // hace lo mismo que haria si se volviera a montar la pantalla anterior
    this.props.navigation.goBack(null);

    /* 
    esta consulta y la de canchas unicamente son necesarias por si el negocio llegara a
    cambiar sus horarios o una cancha mientras un cliente que esta en proceso de reserva
    vuelve desde esta pantalla hacia la anterior
    */
    this.props.onScheduleRead(this.props.commerce.objectID);

    this.props.onCommerceCourtsReadByType({
      commerceId: this.props.commerce.objectID,
      courtType: this.props.courtType
    });

    this.props.onCommerceCourtTypeReservationsRead({
      commerceId: this.props.commerce.objectID,
      selectedDate: this.props.selectedDate,
      courtType: this.props.courtType
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
    return (
      <CommerceCourtStateListItem
        court={item}
        commerceId={this.props.commerce.objectID}
        navigation={this.props.navigation}
        disabled={true} // solo se deshabilita si esta ocupada
        onPress={() => this.onCourtPress(item)}
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
          contentContainerStyle={{ paddingBottom: 95 }}
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
  const { courts, loading } = state.courtsList;
  const { commerce, courtType, slot } = state.courtReservation;
  const { selectedDate } = state.scheduleRegister;

  return { commerce, courtType, courts, loading, slot, selectedDate };
};

export default connect(
  mapStateToProps,
  {
    onCommerceCourtsReadByType,
    onCourtReservationValueChange,
    onCommerceCourtReservationsReadOnSlot,
    onCommerceCourtTypeReservationsRead,
    onScheduleRead
  }
)(CommerceCourtsList);
