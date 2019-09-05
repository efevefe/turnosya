import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Button, Input } from './common';
import {
  onRegisterValueChange,
  onRegister,
  onRegisterFormOpen
} from '../actions';
import { validateValueType, trimString } from '../utils';

class RegisterForm extends Component {
  state = {
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    firstNameError: '',
    lastNameError: '',
    phoneError: ''
  };

  componentWillMount() {
    this.props.onRegisterFormOpen();
  }

  onButtonPressHandler = () => {
    if (this.validateMinimumData()) {
      this.props.onRegister({
        email: this.props.email,
        password: this.props.password,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        phone: this.props.phone
      });
    }
  };

  renderEmailError = () => {
    if (this.props.email == '') {
      this.setState({ emailError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('email', this.props.email)) {
      this.setState({ emailError: 'Formato de email incorrecto' });
      return false;
    } else {
      this.setState({ emailError: '' });
      return true;
    }
  };

  renderPasswordError = () => {
    if (this.props.password == '') {
      this.setState({ passwordError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('password', this.props.password)) {
      this.setState({
        passwordError:
          'La contraseña debe ser alfanumérica y contener al menos 6 caracteres'
      });
      return false;
    } else {
      this.setState({ passwordError: '' });
      return true;
    }
  };

  renderConfirmPasswordError = () => {
    if (this.props.confirmPassword == '') {
      this.setState({ confirmPasswordError: 'Dato requerido' });
      return false;
    } else if (this.props.password != this.props.confirmPassword) {
      this.setState({ confirmPasswordError: 'Las contraseñas no coinciden' });
      return false;
    } else {
      this.setState({ confirmPasswordError: '' });
      return true;
    }
  };

  renderFirstNameError = () => {
    const { firstName, onRegisterValueChange } = this.props;
    const value = trimString(firstName);
    onRegisterValueChange({ prop: 'firstName', value });

    if (value === '') {
      this.setState({ firstNameError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('name', value)) {
      this.setState({ firstNameError: 'El formato del nombre es inválido' });
      return false;
    } else {
      this.setState({ firstNameError: '' });
      return true;
    }
  };

  renderLastNameError = () => {
    const { lastName, onRegisterValueChange } = this.props;
    const value = trimString(lastName);
    onRegisterValueChange({ prop: 'lastName', value });

    if (value === '') {
      this.setState({ lastNameError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('name', this.props.lastName)) {
      this.setState({ lastNameError: 'El formato del apellido es inválido' });
      return false;
    } else {
      this.setState({ lastNameError: '' });
      return true;
    }
  };

  renderPhoneError = () => {
    if (this.props.phone === '') {
      this.setState({ phoneError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('phone', this.props.phone)) {
      this.setState({ phoneError: 'El formato del número es inválido' });
      return false;
    } else {
      this.setState({ phoneError: '' });
      return true;
    }
  };

  validateMinimumData = () => {
    return (
      this.renderEmailError() &&
      this.renderPasswordError() &&
      this.renderConfirmPasswordError() &&
      this.renderFirstNameError() &&
      this.renderLastNameError() &&
      this.renderPhoneError()
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
          <CardSection>
            <Input
              label="E-Mail"
              placeholder="E-Mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.props.email}
              errorMessage={this.state.emailError || this.props.error}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'email',
                  value
                })
              }
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Contraseña"
              placeholder="Contraseña"
              password
              autoCapitalize="none"
              value={this.props.password}
              errorMessage={this.state.passwordError}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'password',
                  value
                })
              }
              onFocus={() => this.setState({ passwordError: '' })}
              onBlur={this.renderPasswordError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Repetir Contraseña"
              placeholder="Repetir Contraseña"
              password
              autoCapitalize="none"
              value={this.props.confirmPassword}
              errorMessage={this.state.confirmPasswordError}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'confirmPassword',
                  value
                })
              }
              onFocus={() => this.setState({ confirmPasswordError: '' })}
              onBlur={this.renderConfirmPasswordError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Nombre"
              placeholder="Nombre"
              autoCapitalize="words"
              value={this.props.firstName}
              errorMessage={this.state.firstNameError}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'firstName',
                  value
                })
              }
              onFocus={() => this.setState({ firstNameError: '' })}
              onBlur={this.renderFirstNameError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Apellido"
              placeholder="Apellido"
              autoCapitalize="words"
              value={this.props.lastName}
              errorMessage={this.state.lastNameError}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'lastName',
                  value
                })
              }
              onFocus={() => this.setState({ lastNameError: '' })}
              onBlur={this.renderLastNameError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Número de Teléfono"
              placeholder="Número de Teléfono"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={this.props.phone}
              errorMessage={this.state.phoneError}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'phone',
                  value
                })
              }
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>
          <CardSection>
            <Button
              title="Confirmar"
              loading={this.props.loading}
              onPress={this.onButtonPressHandler}
            />
          </CardSection>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    loading,
    error
  } = state.clientData;

  return {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    loading,
    error
  };
};

export default connect(
  mapStateToProps,
  { onRegisterValueChange, onRegister, onRegisterFormOpen }
)(RegisterForm);
