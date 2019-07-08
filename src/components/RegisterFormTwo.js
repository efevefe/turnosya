import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { onRegister, onRegisterValueChange } from '../actions';

class RegisterFormTwo extends Component {
  state = { firstNameError: '', lastNameError: '', phoneError: '' };

  onConfirmPressHandler() {
    this.props.onRegister({
      email: this.props.email,
      password: this.props.password,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      phone: this.props.phone
    });
  }

  render() {
    return (
      <View style={{ padding: 15, alignSelf: 'stretch' }}>
        <CardSection>
          <Input
            placeholder="Nombre"
            onChangeText={value =>
              this.props.onRegisterValueChange({
                prop: 'firstName',
                value
              })
            }
            onFocus={() => this.setState({ nameError: '' })}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Apellido"
            onChangeText={value =>
              this.props.onRegisterValueChange({
                prop: 'lastName',
                value
              })
            }
            onFocus={() => this.setState({ lastNameError: '' })}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Número de Teléfono"
            keyboardType="numeric"
            onChangeText={value =>
              this.props.onRegisterValueChange({
                prop: 'phone',
                value
              })
            }
            onFocus={() => this.setState({ phoneError: '' })}
          />
        </CardSection>
        <CardSection>
          <Button
            title="Registrarse"
            loading={this.props.loading}
            onPress={this.onConfirmPressHandler.bind(this)}
          />
        </CardSection>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    loading,
    error
  } = state.registerForm;

  return { email, password, firstName, lastName, phone, loading, error };
};

export default connect(
  mapStateToProps,
  { onRegister, onRegisterValueChange }
)(RegisterFormTwo);
