import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { EmptyList, Spinner } from '../common';
import { onServicesRead, onReservationValueChange, onServicesByEmployeeRead } from '../../actions';

class CommerceServicesList extends Component {
  componentDidMount() {
    if (this.props.employee) {
      this.unsubscribeServices = this.props.onServicesByEmployeeRead({
        commerceId: this.props.commerce.objectID,
        employeeId: this.props.employee.id
      });
    } else {
      this.unsubscribeServices = this.props.onServicesRead(this.props.commerce.objectID);
    }
  }

  componentWillUnmount() {
    this.unsubscribeServices && this.unsubscribeServices();
  }

  onServicePress = service => {
    this.props.onReservationValueChange({ service, price: service.price });

    if (this.props.navigation.getParam('navigatedFromProfile')) {
      this.props.navigation.navigate('commerceEmployeesList');
    } else {
      this.props.navigation.navigate('commerceServicesSchedule');
    }
  };

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
  };

  render() {
    if (this.props.loading) return <Spinner />;

    if (this.props.services.length) {
      return (
        <FlatList
          data={this.props.services}
          renderItem={this.renderItem}
          keyExtractor={service => service.id}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      );
    }

    return <EmptyList title="Parece que no hay servicios" />;
  }
}

const mapStateToProps = state => {
  const { commerce, employee } = state.reservation;
  const { services, loading } = state.servicesList;

  return { commerce, services, loading, employee };
};

export default connect(mapStateToProps, {
  onServicesRead,
  onReservationValueChange,
  onServicesByEmployeeRead
})(CommerceServicesList);
