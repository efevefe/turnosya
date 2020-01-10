import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from 'react-navigation-stack';
import { Spinner, EmptyList } from '../common';
import EmployeesListItem from './EmployeesListItem';
import { readEmployees } from '../../actions';
import { MAIN_COLOR } from '../../constants';
import PermissionsAssigner from '../common/PermissionsAssigner';
import { ROLES } from '../../constants';

class EmployeesList extends Component {
  componentDidMount() {
    this.unsubEmployeesRead = this.props.readEmployees(this.props.commerceId);
  }

  componentWillUnmount() {
    this.unsubEmployeesRead && this.unsubEmployeesRead();
  }

  renderRow({ item }) {
    return (
      <EmployeesListItem
        employee={item}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

  onAddPress = () => {
    this.props.navigation.navigate('employeeForm');
  };

  renderList = () => {
    return this.props.employees.length ? (
      <FlatList
        data={this.props.employees}
        renderItem={this.renderRow.bind(this)}
        keyExtractor={employee => employee.id}
        contentContainerStyle={{ paddingBottom: 95 }}
      />
    ) : (
      <EmptyList title="No hay ningún empleado" />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <PermissionsAssigner requiredRole={ROLES.ADMIN}>
          <Fab
            style={{ backgroundColor: MAIN_COLOR }}
            position="bottomRight"
            onPress={() => this.onAddPress()}
          >
            <Ionicons name="md-add" />
          </Fab>
        </PermissionsAssigner>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { employees, loading } = state.employeesList;
  const { commerceId } = state.commerceData;

  return { employees, loading, commerceId };
};

export default connect(mapStateToProps, { readEmployees })(EmployeesList);
