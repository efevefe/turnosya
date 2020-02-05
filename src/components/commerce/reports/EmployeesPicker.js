import React from 'react';
import { connect } from 'react-redux';
import { CardSection, Picker } from '../../common';
import { onCommerceReportValueChange } from '../../../actions';

const EmployeesPicker = props => {
  formatEmployees = () => {
    return props.employees.map(employee => {
      return {
        value: employee.id,
        label: (`${employee.firstName} ${employee.lastName}`).trim()
      }
    })
  }

  return (
    <CardSection>
      <Picker
        title='Empleado:'
        placeholder={{ label: 'Todos', value: null }}
        items={formatEmployees()}
        value={props.selectedEmployeeId}
        onValueChange={selectedEmployeeId => props.onCommerceReportValueChange({ selectedEmployeeId })}
      />
    </CardSection>
  );
}

const mapStateToProps = state => {
  return {
    employees: state.employeesList.employees,
    selectedEmployeeId: state.commerceReports.selectedEmployeeId
  }
}

export default connect(mapStateToProps, { onCommerceReportValueChange })(EmployeesPicker);