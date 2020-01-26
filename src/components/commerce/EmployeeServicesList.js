import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { EmptyList } from '../common';
import { onReservationValueChange, onNewReservation } from '../../actions';

class EmployeeServicesList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title')
  });

  componentDidUpdate(prevProps) {
    if (!prevProps.saved && this.props.saved ||
      !prevProps.exists && this.props.exists) {
      this.props.navigation.replace('serviceReservationRegister');
    }
  }

  onServicePress = service => {
    const { startDate } = this.props;

    this.props.onNewReservation()

    this.props.onReservationValueChange({
      service,
      price: service.price,
      endDate: moment(startDate).add(parseInt(service.duration), 'minutes')
    });

    this.props.navigation.navigate('serviceReservationRegister');
  }

  isResFillingSlot = (slot, res) => {
    return (
      slot.startDate.toString() >= res.startDate.toString() && slot.startDate.toString() < res.endDate.toString()
    );
  }

  enoughTime = service => {
    const startDate = this.props.startDate;
    const res = {
      startDate,
      endDate: moment(startDate).add(parseInt(service.duration), 'minutes')
    };

    const shiftsIds = new Set();

    const notAvailableSlot = this.props.slots.some(slot => {
      if (slot.divider) return false;

      if (this.isResFillingSlot(slot, res)) {
        shiftsIds.add(slot.shiftsIds);
        return !slot.available;
      }

      return false;
    });

    const endSlot = this.props.slots.some(slot => {
      if (slot.divider) return false;

      return (slot.startDate.toString() < res.endDate.toString() &&
        slot.endDate.toString() >= res.endDate.toString());
    });

    // endSlot: para verificar que existe un slot que cubre la hora de finalizacion del turno
    // !notAvailableSlot: no tiene que haber slots ocupados entre los slots que ocupa el servicio
    // (shiftsIds.size === 1): todos los slots deben pertenecer al mismo turno (primero o segundo)
    return endSlot && !notAvailableSlot && shiftsIds.size === 1;
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        title={item.name}
        subtitle={`Duración: ${item.duration} min.`}
        rightTitle={`$${item.price}`}
        rightTitleStyle={{ fontWeight: 'bold', color: 'black' }}
        rightIcon={{
          name: 'ios-arrow-forward',
          type: 'ionicon',
          color: 'black'
        }}
        bottomDivider
        onPress={() => this.onServicePress(item)}
      />
    );
  }

  getAvailableServices = () => {
    const { employeeId, services } = this.props;

    return services.filter(service =>
      service.employeesIds.includes(employeeId) && this.enoughTime(service)
    );
  }

  render() {
    const services = this.getAvailableServices();

    if (services.length) {
      return (
        <FlatList
          data={services}
          renderItem={this.renderItem}
          keyExtractor={service => service.id}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      );
    }

    return <EmptyList title='Parece que no hay servicios disponibles' />
  }
}

const mapStateToProps = state => {
  const { slots } = state.commerceSchedule;
  const { employeeId } = state.roleData;
  const { commerceId } = state.commerceData;
  const { services, loading } = state.servicesList;
  const { startDate, saved, exists } = state.reservation;

  return { commerceId, services, slots, startDate, loading, employeeId, saved, exists };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onNewReservation
})(EmployeeServicesList);