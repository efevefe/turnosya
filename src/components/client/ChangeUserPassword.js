import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { Button, Input, CardSection } from '../common';
import { onLoginValueChange, onClientDataValueChange, onUserPasswordUpdate } from '../../actions';
import { validateValueType } from '../../utils';

class ChangeUserPassword extends Component {
  state = { passwordError: '', newPasswordError: '', confirmPasswordError: '' };

  passwordError = () => {
    if (!this.props.password) {
      this.setState({ passwordError: 'Dato requerido' });
      return false;
    }

    this.setState({ passwordError: '' });
    return true;
  };

  newPasswordError = () => {
    if (!this.props.newPassword) {
      this.setState({ newPasswordError: 'Dato requerido' });
    } else if (!validateValueType('password', this.props.newPassword)) {
      this.setState({
        newPasswordError: 'La contraseña debe ser alfanumérica y contener al menos 6 caracteres'
      });
    } else if (this.props.newPassword === this.props.password) {
      this.setState({
        newPasswordError: 'La nueva contraseña debe ser diferente a la actual'
      });
    } else {
      this.setState({ newPasswordError: '' });
      return true;
    }

    return false;
  };

  confirmPasswordError = () => {
    if (!this.props.confirmPassword) {
      this.setState({ confirmPasswordError: 'Dato requerido' });
    } else if (this.props.confirmPassword !== this.props.newPassword) {
      this.setState({ confirmPasswordError: 'Las contraseñas no coinciden' });
    } else {
      this.setState({ confirmPasswordError: '' });
      return true;
    }

    return false;
  };

  validateMinimumData = () => {
    return !this.props.reauthError && this.passwordError() && this.newPasswordError() && this.confirmPasswordError();
  };

  onSavePress = () => {
    if (this.validateMinimumData()) {
      this.props.onUserPasswordUpdate(
        {
          password: this.props.password,
          newPassword: this.props.newPassword
        },
        this.props.navigation
      );
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <Card
          containerStyle={{
            padding: 5,
            paddingTop: 10,
            borderRadius: 10
          }}
        >
          <CardSection>
            <Input
              label="Contraseña actual:"
              placeholder="Ingresar contraseña actual"
              password
              value={this.props.password}
              onChangeText={password => this.props.onLoginValueChange({ password })}
              errorMessage={this.props.reauthError || this.state.passwordError}
              onFocus={() => this.props.onLoginValueChange({ error: '' })}
              onBlur={this.passwordError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Nueva contraseña:"
              placeholder="Ingresar nueva contraseña"
              password
              value={this.props.newPassword}
              onChangeText={password => this.props.onClientDataValueChange({ password })}
              errorMessage={this.state.newPasswordError}
              onFocus={() => this.setState({ newPasswordError: '' })}
              onBlur={this.newPasswordError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Repetir contraseña:"
              placeholder="Confirmar nueva contraseña"
              password
              value={this.props.confirmPassword}
              onChangeText={confirmPassword => this.props.onClientDataValueChange({ confirmPassword })}
              errorMessage={this.state.confirmPasswordError}
              onFocus={() => this.setState({ confirmPasswordError: '' })}
              onBlur={this.confirmPasswordError}
            />
          </CardSection>
          <CardSection>
            <Button title="Guardar" loading={this.props.loading} onPress={this.onSavePress} />
          </CardSection>
        </Card>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { password, error } = state.auth;
  const newPassword = state.clientData.password;
  const { confirmPassword, refreshing } = state.clientData;

  return {
    loading: refreshing,
    password,
    newPassword,
    confirmPassword,
    reauthError: error
  };
};

export default connect(mapStateToProps, {
  onLoginValueChange,
  onClientDataValueChange,
  onUserPasswordUpdate
})(ChangeUserPassword);
