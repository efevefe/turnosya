import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { NavigationActions } from 'react-navigation';
import { onRegister, onValueChange } from '../actions';
import { validateValueType } from './common/validate';

class RegisterForm extends Component {
  state = { emailError: '', passwordError: '' };

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      this.props.onRegister({
        email: this.props.email,
        password: this.props.password
      });
      
      this.props.navigation.goBack();
    }
  }

  renderEmailError = () => {
    if (!validateValueType('email', this.props.email)) {
      this.setState({ emailError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ emailError: '' });
      return true;
    }
  };

  renderPasswordError = () => {
    if (this.props.password == this.props.confirmPassword) {
      this.setState({ passwordError: '' });
      return true;
    } else {
      this.setState({ passwordError: 'Las contraseñas no coinciden' });
      return false;
    }
  };

  validateMinimumData = () => {
    return this.renderEmailError() && this.renderPasswordError();
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
              this.props.onValueChange({
                prop: 'email',
                value
              })
            }
            onFocus={() => this.setState({ emailError: '' })}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Contraseña"
            secureTextEntry
            value={this.props.password}
            onChangeText={value =>
              this.props.onValueChange({
                prop: 'password',
                value
              })
            }
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Repetir Contraseña"
            secureTextEntry
            value={this.props.confirmPassword}
            errorMessage={this.state.passwordError}
            onChangeText={value =>
              this.props.onValueChange({
                prop: 'confirmPassword',
                value
              })
            }
            onFocus={() => this.setState({ passwordError: '' })}
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
  { onRegister, onValueChange }
)(RegisterForm);
