import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { BadgeButtonGroup } from '../common';
import { onEmployeeSelect } from '../../actions';

class EmployeesFilter extends Component {
  state = {
    selectedIndex: 0,
    buttons: {
      names: ['Mis Turnos'],
      ids: [this.props.currentEmployeeId]
    }
  };

  componentDidMount() {
    this.generateButtons();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.employees !== this.props.employees) {
      this.generateButtons();
    }

    if (!this.props.isFocused && prevProps.selectedEmployeeId !== this.props.selectedEmployeeId) {
      this.setState({ selectedIndex: this.state.buttons.ids.indexOf(this.props.selectedEmployeeId) });
    }
  }

  generateButtons = () => {
    const prevSelectedEmployeeId = this.props.selectedEmployeeId || this.state.buttons.ids[this.state.selectedIndex];
    const buttons = { names: ['Mis Turnos'], ids: [this.props.currentEmployeeId] };

    for (const employee of this.props.employees) {
      if (employee.id !== this.props.currentEmployeeId) {
        const employeeName = (`${employee.firstName} ${employee.lastName}`).trim();
        buttons.names.push(employeeName);
        buttons.ids.push(employee.id);
      }
    }

    const prevSelectedEmployeeIndex = buttons.ids.indexOf(prevSelectedEmployeeId);
    const selectedIndex = (prevSelectedEmployeeIndex > 0) ? prevSelectedEmployeeIndex : 0;

    this.setState({ buttons }, () => this.updateIndex(selectedIndex));
  }

  updateIndex = selectedIndex => {
    if (selectedIndex !== this.state.selectedIndex) {
      const selectedEmployeeId = this.state.buttons.ids[selectedIndex];
      this.props.onEmployeeSelect(selectedEmployeeId);
      this.props.onValueChange(selectedEmployeeId);
      this.setState({ selectedIndex });
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
    selectedEmployeeId: state.employeesList.selectedEmployeeId,
    commerceId: state.commerceData.commerceId
  };
}

export default connect(mapStateToProps, { onEmployeeSelect })(withNavigationFocus(EmployeesFilter));