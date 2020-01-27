import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { EmptyList, Spinner } from '../common';
import { onReservationValueChange, onEmployeesRead, onEmployeesByIdRead } from '../../actions';

class CommerceEmployeesList extends Component {
  componentDidMount() {
    if (this.props.service) {
      this.props.onEmployeesByIdRead({
        commerceId: this.props.commerce.objectID,
        employeesIds: this.props.service.employeesIds
      });
    } else {
      this.props.onEmployeesRead(this.props.commerce.objectID);
    }
  }

  onEmployeePress = employee => {
    this.props.onReservationValueChange({ employee });

    if (this.props.service) {
      this.props.navigation.navigate('commerceServicesSchedule');
    } else {
      this.props.navigation.navigate('commerceServicesList');
    }
  };

  renderItem = ({ item }) => {
    return (
      <ListItem
        leftAvatar={{
          source: item.profilePicture ? { uri: item.profilePicture } : null,
          icon: { name: 'person', type: 'material' },
          size: 'medium'
        }}
        title={`${item.firstName} ${item.lastName}`}
        rightIcon={{
          name: 'ios-arrow-forward',
          type: 'ionicon',
          color: 'black'
        }}
        bottomDivider
        onPress={() => this.onEmployeePress(item)}
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

    if (this.props.employees.length) {
      return (
        <FlatList
          data={this.props.employees}
          renderItem={this.renderItem}
          keyExtractor={employee => employee.id}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      );
    }

    return <EmptyList title="Parece que no hay estilistas" />;
  }
}

const mapStateToProps = state => {
  const { commerce, service } = state.reservation;
  const { employees, loading } = state.employeesList;

  return { commerce, service, employees, loading };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onEmployeesRead,
  onEmployeesByIdRead
})(CommerceEmployeesList);
