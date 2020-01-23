import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Card, Button as RNEButton } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onEmployeeValueChange,
  onEmployeeValuesReset,
  onRolesRead,
  onUserByEmailSearch,
  onEmployeeInfoUpdate,
  onEmployeeCreate,
  onEmployeeUpdate
} from '../../actions';
import { CardSection, Input, Picker, Button, IconButton } from '../common';
import { MAIN_COLOR, ROLES } from '../../constants';

class EmployeeForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      roleError: '',
      editing: props.navigation.getParam('editing') || false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightButton')
    }
  }

  componentDidMount() {
    if (this.state.editing) {
      this.props.navigation.setParams({
        rightButton: <IconButton icon='md-refresh' onPress={() => this.props.onEmployeeInfoUpdate(this.props.email)} />
      })
    }

    this.props.onRolesRead();
  }

  componentWillUnmount() {
    this.props.onEmployeeValuesReset();
  }

  onEmailValueChange = email => {
    this.props.firstName
      ? this.props.onEmployeeValueChange({
        firstName: '',
        lastName: '',
        phone: '',
        email
      })
      : this.props.onEmployeeValueChange({ email });
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
        this.props.onEmployeeValueChange({
          emailError: 'Este usuario ya es empleado de su negocio'
        });
      // Si se cargó un usuario y no es empleado aca entonces guardarlo
      else if (role.name)
        if (this.state.editing)
          this.props.onEmployeeUpdate(
            {
              commerceId,
              employeeId,
              firstName,
              lastName,
              phone,
              role
            },
            navigation
          );
        else
          this.props.onEmployeeCreate(
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
      this.props.onEmployeeValueChange({
        emailError: 'Debe cargar un usuario antes de guardar'
      });
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
            <CardSection
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start'
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
                rightIcon={
                  <RNEButton
                    type="clear"
                    icon={{
                      name: 'md-search',
                      type: 'ionicon',
                      color: MAIN_COLOR
                    }}
                    loading={this.props.emailLoading}
                    onPress={() =>
                      this.props.onUserByEmailSearch(
                        this.props.email,
                        this.props.commerceId
                      )
                    }
                    loadingProps={{ color: MAIN_COLOR }}
                    disabled={this.state.editing}
                  />
                }
              />
            </CardSection>

            <CardSection>
              <Input
                label="Nombre:"
                value={this.props.firstName}
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Input
                label="Apellido:"
                value={this.props.lastName}
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Input
                label="Teléfono:"
                value={this.props.phone}
                editable={false}
              />
            </CardSection>

            <CardSection>
              <Picker
                title={'Rol:'}
                placeholder={{ value: null, label: 'Seleccionar...' }}
                value={this.props.role}
                items={this.props.roles.filter(
                  role =>
                    ROLES[role.value.roleId].value <=
                    this.props.currentRole.value
                )}
                onValueChange={role =>
                  this.props.onEmployeeValueChange({ role: role || {} })
                }
                errorMessage={this.state.roleError}
                disabled={this.props.email === firebase.auth().currentUser.email}
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
  const { roles, role: currentRole } = state.roleData;
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
    currentRole,
    emailLoading,
    emailError,
    saveLoading,
    employees
  };
};

export default connect(mapStateToProps, {
  onEmployeeValueChange,
  onEmployeeValuesReset,
  onRolesRead,
  onUserByEmailSearch,
  onEmployeeInfoUpdate,
  onEmployeeCreate,
  onEmployeeUpdate
})(EmployeeForm);
