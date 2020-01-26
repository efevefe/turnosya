import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BadgeButtonGroup } from '../common';
import { onEmployeesRead } from '../../actions';

class EmployeesFilter extends Component {
  state = {
    selectedIndex: 0,
    buttons: {
      names: ['Mis Turnos'],
      ids: [this.props.currentEmployeeId]
    }
  };

  componentDidMount() {
    this.unsubscribeEmployeesRead = this.props.onEmployeesRead(
      this.props.commerceId
    );

    this.generateButtons();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.employees !== this.props.employees) {
      this.generateButtons();
    }
  }

  componentWillUnmount() {
    this.unsubscribeEmployeesRead && this.unsubscribeEmployeesRead();
  }

  generateButtons = () => {
    const prevSelectedEmployeeId = this.state.buttons.ids[this.state.selectedIndex];
    const buttons = { names: ['Mis Turnos'], ids: [this.props.currentEmployeeId] };

    for (const employee of this.props.employees) {
      if (employee.id !== this.props.currentEmployeeId) {
        const employeeName = (`${employee.firstName} ${employee.lastName}`).trim();
        buttons.names.push(employeeName);
        buttons.ids.push(employee.id);
      }
    }

    const prevSelectedEmployeeIndex = this.state.buttons.ids.indexOf(prevSelectedEmployeeId);
    const selectedIndex = (prevSelectedEmployeeIndex > 0) ? prevSelectedEmployeeIndex : 0;

    this.setState(
      { buttons },
      () => this.updateIndex(selectedIndex)
    );
  }

  updateIndex = selectedIndex => {
    if (selectedIndex !== this.state.selectedIndex) {
      this.setState({ selectedIndex });
      this.props.onValueChange(this.state.buttons.ids[selectedIndex]);
    }
  }

  render() {
    // solo se muestra si hay mas de 1 empleado
    if (this.state.buttons.names < 2) return null;

    return (
      <BadgeButtonGroup
        buttons={this.state.buttons.names}
        onPress={this.updateIndex}
        selectedIndex={this.state.selectedIndex}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    employees: state.employeesList.employees,
    currentEmployeeId: state.roleData.employeeId,
    commerceId: state.commerceData.commerceId
  };
}

export default connect(mapStateToProps, { onEmployeesRead })(EmployeesFilter);