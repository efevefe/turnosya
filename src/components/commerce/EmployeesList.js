import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from 'react-navigation-stack';
import { NavigationEvents } from 'react-navigation';
import { Spinner, EmptyList } from '../common';
import EmployeesListItem from './EmployeesListItem';
import { readEmployees } from '../../actions';
import { MAIN_COLOR } from '../../constants';

class EmployeesList extends Component {
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

  renderBackButton = () => (
    <HeaderBackButton onPress={this.onBackButtonPress} tintColor="white" />
  );

  onBackButtonPress = () => {
    this.props.navigation.goBack(null);
  };

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
    // CAMBIAR EL ID DEL KEY
    return this.props.employees.length > 0 ? (
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
        <NavigationEvents
          onDidFocus={() =>
            (this.unsubEmployeesRead = this.props.readEmployees(
              this.props.commerceId
            ))
          }
          onDidBlur={() => this.unsubEmployeesRead && this.unsubEmployeesRead()}
        />
        {this.renderList()}

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.onAddPress()}
        >
          <Ionicons name="md-add" />
        </Fab>
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
