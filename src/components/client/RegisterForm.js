import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Button, Input } from '../common';
import { onClientDataValueChange, onUserRegister, onRegisterFormOpen } from '../../actions';
import { validateValueType, trimString } from '../../utils';

class RegisterForm extends Component {
  state = {
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    firstNameError: '',
    lastNameError: '',
    phoneError: ''
  };

  componentDidMount() {
    this.props.onRegisterFormOpen();
  }

  onButtonPressHandler = () => {
    if (this.validateMinimumData()) {
      this.props.onUserRegister({
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
        passwordError: 'La contraseña debe ser alfanumérica y contener al menos 6 caracteres'
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
            this.setState({
                confirmPasswordError: 'Las contraseñas no coinciden',
            });
            return false;
        } else {
            this.setState({ confirmPasswordError: '' });
            return true;
        }
    };

  renderFirstNameError = () => {
    const firstName = trimString(this.props.firstName);

    this.props.onClientDataValueChange({ firstName });
    if (firstName === '') {
      this.setState({ firstNameError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('name', firstName)) {
      this.setState({ firstNameError: 'El formato del nombre es inválido' });
      return false;
    } else {
      this.setState({ firstNameError: '' });
      return true;
    }
  };

  renderLastNameError = () => {
    const lastName = trimString(this.props.lastName);

    this.props.onClientDataValueChange({ lastName });
    if (lastName === '') {
      this.setState({ lastNameError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('name', lastName)) {
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
              onChangeText={email => this.props.onClientDataValueChange({ email })}
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
              onChangeText={password => this.props.onClientDataValueChange({ password })}
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
              onChangeText={confirmPassword => this.props.onClientDataValueChange({ confirmPassword })}
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
              onChangeText={firstName => this.props.onClientDataValueChange({ firstName })}
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
              onChangeText={lastName => this.props.onClientDataValueChange({ lastName })}
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
              onChangeText={phone => this.props.onClientDataValueChange({ phone })}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>
          <CardSection>
            <Button title="Confirmar" loading={this.props.loading} onPress={this.onButtonPressHandler} />
          </CardSection>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { email, password, confirmPassword, firstName, lastName, phone, loading, error } = state.clientData;

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

export default connect(mapStateToProps, {
  onClientDataValueChange,
  onUserRegister,
  onRegisterFormOpen
})(RegisterForm);
