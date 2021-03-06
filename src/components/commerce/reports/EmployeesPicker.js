import React from 'react';
import { connect } from 'react-redux';
import { CardSection, Picker, PermissionsAssigner, AreaComponentRenderer } from '../../common';
import { ROLES } from '../../../constants';

const EmployeesPicker = props => {
  onEmployeesPickerValueChange = (value, index) => {
    const selectedEmployee = {
      id: value,
      name: value ? props.employees[index - 1].label : null
    };

    props.onPickerValueChange(selectedEmployee);
  }

  return (
    <AreaComponentRenderer
      hairdressers={
        <PermissionsAssigner requiredRole={ROLES.ADMIN}>
          <CardSection>
            <Picker
              {...props}
              title='Empleado:'
              placeholder={{ label: 'Todos', value: null }}
              items={props.employees}
              onValueChange={(value, index) => this.onEmployeesPickerValueChange(value, index)}
            />
          </CardSection>
        </PermissionsAssigner>
      }
    />
  );
}

const mapStateToProps = state => {
  const employees = state.employeesList.employees.map(employee => ({
    value: employee.id,
    label: (`${employee.firstName} ${employee.lastName}`).trim()
  }));

  return { employees };
}

export default connect(mapStateToProps, null)(EmployeesPicker);