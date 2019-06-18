import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { CardSection } from './common';
import { MAIN_COLOR } from '../constants';
import { NavigationActions } from 'react-navigation';
import { onRegister, onValueChange } from '../actions';
import { validateValueType } from './common/validate';

class RegisterForm extends Component {
  //   state = { email: '', password: '', repeatPassword: '' };

  //   renderIcon(name) {
  //     return (
  //       <Icon name={name} color="#bbb" size={20} style={{ marginRight: 5 }} />
  //     );
  //   }

  //   labelRender() {
  //     const { email } = this.state;

  //     email ? this.setState({ email: '' }) : this.setState({ email: 'E-Mail:' });
  //   }

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
    const { inputContainerStyle, inputStyle, buttonStyle } = styles;

    return (
      <View style={{ padding: 15, alignSelf: 'stretch' }}>
        {/* <CardSection>
          <Input
            placeholder="Nombre"
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Apellido"
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Telefono"
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
          />
        </CardSection> */}
        <CardSection>
          <Input
            placeholder="E-Mail"
            autoCapitalize="none"
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
            value={this.props.email}
            keyboardType="email-address"
            onChangeText={value =>
              this.props.onValueChange({
                prop: 'email',
                value
              })
            }
            errorMessage={this.state.emailError}
            onFocus={() => this.setState({ emailError: '' })}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
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
            autoCapitalize="none"
            secureTextEntry
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
            value={this.props.confirmPassword}
            onChangeText={value =>
              this.props.onValueChange({
                prop: 'confirmPassword',
                value
              })
            }
            errorMessage={this.state.passwordError}
            onFocus={() => this.setState({ passwordError: '' })}
          />
        </CardSection>
        <CardSection>
          <Button
            title="Registrar"
            buttonStyle={buttonStyle}
            loading={this.props.loading}
            onPress={this.onButtonPressHandler.bind(this)}
          />
        </CardSection>
      </View>
    );
  }
}

const styles = {
  inputContainerStyle: {
    borderBottomWidth: 1.5,
    borderColor: MAIN_COLOR
  },
  inputStyle: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16
  },
  buttonStyle: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: MAIN_COLOR
  }
};

const mapStateToProps = state => {
  const { email, password, confirmPassword, loading } = state.registerForm;

  return { email, password, confirmPassword, loading };
};

export default connect(
  mapStateToProps,
  { onRegister, onValueChange }
)(RegisterForm);
