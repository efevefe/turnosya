import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { onRegister, onRegisterValueChange } from '../actions';
import { validateValueType } from './common/validate';

class RegisterForm extends Component {
  state = { emailError: '', passwordError: '', confirmPasswordError: '' };

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      this.props.onRegister({
        email: this.props.email,
        password: this.props.password
      });
    }
  }

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
      this.setState({ passwordError: 'La contraseña debe ser alfanumerica y contener al menos 6 caracteres' });
      return false;
    } else {
      this.setState({ passwordError: '' });
      return true;
    }
  }

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

  validateMinimumData = () => {
    return (
      this.renderEmailError() &&
      this.renderPasswordError() &&
      this.renderConfirmPasswordError()
    );
  };

  render() {
    return (
      <View style={{ padding: 15, alignSelf: 'stretch' }}>
        <CardSection>
          <Input
            placeholder="E-Mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={this.props.email}
            errorMessage={this.state.emailError}
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
            placeholder="Contraseña"
            secureTextEntry
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
            placeholder="Repetir Contraseña"
            secureTextEntry
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
          <Button
            title="Registrar"
            loading={this.props.loading}
            onPress={this.onButtonPressHandler.bind(this)}
          />
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { email, password, confirmPassword, loading } = state.registerForm;

  return { email, password, confirmPassword, loading };
};

export default connect(
  mapStateToProps,
  { onRegister, onRegisterValueChange }
)(RegisterForm);
