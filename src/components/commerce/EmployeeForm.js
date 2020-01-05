import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  employeeValueChange,
  employeeNameClear,
  employeeClear,
  readRoles,
  searchUserEmail,
  createEmployee,
  employeeValidationError,
  loadEmployee,
  updateEmployee
} from '../../actions';
import { CardSection, Input, Picker, Button, Spinner } from '../common';
import { MAIN_COLOR } from '../../constants';

class EmployeeForm extends Component {
  state = { roleError: '', editing: false };

  componentDidMount() {
    this.props.readRoles();

    const employee = this.props.navigation.getParam('employee', null);

    if (employee) {
      this.setState({ editing: true });
      this.props.loadEmployee(employee);
    }
  }

  componentWillUnmount() {
    this.props.employeeClear();
  }

  renderEmailButton = () => {
    return this.state.editing ? null : this.props.emailLoading ? (
      <Spinner
        style={{
          position: 'relative',
          height: 0,
          width: 0,
          padding: 5
        }}
        size="small"
      />
    ) : (
      <TouchableOpacity
        style={{ flex: 1, padding: 5 }}
        onPress={() =>
          this.props.searchUserEmail(this.props.email, this.props.commerceId)
        }
      >
        <Icon name="search" color={MAIN_COLOR} size={24} />
      </TouchableOpacity>
    );
  };

  onEmailValueChange = value => {
    if (this.props.firstName) this.props.employeeNameClear();
    this.props.employeeValueChange('email', value);
  };

  onSavePressHandler = () => {
    const {
      commerceId,
      commerceName,
      email,
      firstName,
      lastName,
      phone,
      role,
      profileId,
      employeeId,
      employees,
      navigation
    } = this.props;
    if (firstName) {
      if (
        employees.some(employee => employee.profileId === profileId) &&
        !this.state.editing
      )
        // Si se cargó un usuario y es empleado aca entonces notificar
        this.props.employeeValidationError(
          'Este usuario ya es empleado de su negocio'
        );
      // Si se cargó un usuario y no es empleado aca entonces guardarlo
      else if (role.name)
        if (this.state.editing)
          this.props.updateEmployee(
            {
              commerceId,
              employeeId,
              email,
              role
            },
            navigation
          );
        else
          this.props.createEmployee(
            {
              commerceId,
              commerceName,
              email,
              firstName,
              lastName,
              phone,
              role,
              profileId
            },
            navigation
          );
    } else {
      this.props.employeeValidationError(
        'Debe cargar un usuario antes de guardar'
      );
    }

    if (role.name && this.state.roleError) this.setState({ roleError: '' });
    else if (!role.name && !this.state.roleError)
      this.setState({ roleError: 'Debe especificar un rol para el empleado' });
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={20}>
        <View>
          <Card containerStyle={styles.cardStyle}>
            <View
              style={{
                alignSelf: 'stretch',
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Input
                label="Email:"
                placeholder="Busque por email..."
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.props.email}
                errorMessage={this.props.emailError}
                onChangeText={this.onEmailValueChange}
                containerStyle={{ flex: 10 }}
                editable={!this.state.editing} // No se puede modificar la persona, porque se debe enviar invitación y eso
              />
              {this.renderEmailButton()}
            </View>

            <CardSection>
              <Input
                label="Nombre:"
                value={this.props.firstName}
                onChangeText={value =>
                  this.props.employeeValueChange('firstName', value)
                }
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Input
                label="Apellido:"
                value={this.props.lastName}
                onChangeText={value =>
                  this.props.employeeValueChange('lastName', value)
                }
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Input
                label="Teléfono:"
                value={this.props.phone}
                onChangeText={value =>
                  this.props.employeeValueChange('phone', value)
                }
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Picker
                title={'Rol:'}
                placeholder={{ value: null, label: 'Elija una opción...' }}
                value={this.props.role}
                items={this.props.roles}
                onValueChange={value =>
                  this.props.employeeValueChange('role', value || {})
                }
                errorMessage={this.state.roleError}
              />
            </CardSection>

            <CardSection>
              <Button
                title="Guardar"
                loading={this.props.saveLoading}
                onPress={this.onSavePressHandler}
              />
            </CardSection>
          </Card>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const mapStateToProps = state => {
  const { commerceId, name } = state.commerceData;
  const {
    email,
    phone,
    firstName,
    lastName,
    profileId,
    id,
    role,
    emailLoading,
    emailError,
    saveLoading
  } = state.employeeData;
  const { roles } = state.roleData;
  const { employees } = state.employeesList;

  return {
    commerceId,
    commerceName: name,
    email,
    phone,
    firstName,
    lastName,
    profileId,
    employeeId: id,
    role,
    roles,
    emailLoading,
    emailError,
    saveLoading,
    employees
  };
};

export default connect(mapStateToProps, {
  employeeValueChange,
  employeeNameClear,
  employeeClear,
  readRoles,
  searchUserEmail,
  createEmployee,
  employeeValidationError,
  loadEmployee,
  updateEmployee
})(EmployeeForm);
