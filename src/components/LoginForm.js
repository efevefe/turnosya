import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CardSection, Button, Input } from './common';
import { validateValueType } from '../utils';
import {
  onLogin,
  onLoginValueChange,
  onFacebookLogin,
  onGoogleLogin
} from '../actions';

import { ImagePicker, Permissions } from 'expo';

const iconSize = Math.round(Dimensions.get('window').height) * 0.18;

class LoginForm extends Component {
  state = { emailError: '', passwordError: '' };

  // pruebaFoto() {
  //   async function getCameraPermsAsync() {
  //     // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
  //     const { status, permissions } = await Permissions.askAsync(
  //       Permissions.CAMERA_ROLL
  //     );
  //     const { status2, permissions2 } = await Permissions.askAsync(
  //       Permissions.CAMERA
  //     );
  //   }

  //   getCameraPermsAsync().then(() => ImagePicker.launchImageLibraryAsync());
  // }

  onButonPressHandler() {
    if (this.validateMinimumData()) {
      this.props.onLogin({
        email: this.props.email,
        password: this.props.password
      });
    }
  }

  onCreateAcount() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'registerForm'
    });

    this.props.navigation.navigate(navigateAction);
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

  validateMinimumData = () => {
    return this.renderEmailError() && this.renderPasswordError();
  };

  render() {
    const {
      containerStyle,
      logoContainerStyle,
      loginContainerStyle,
      createAccountContainerStyle
    } = styles;
    return (
      <View style={containerStyle}>
        <View style={logoContainerStyle}>
          <Image
            source={require('../../assets/icon.png')}
            style={{ height: iconSize, width: iconSize }}
          />
        </View>
        <View style={loginContainerStyle}>
          <CardSection>
            <Input
              placeholder="E-Mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.props.email}
              errorMessage={this.state.emailError}
              onChangeText={value =>
                this.props.onLoginValueChange({
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
              autoCapitalize="none"
              value={this.props.password}
              errorMessage={this.state.passwordError || this.props.error}
              onChangeText={value =>
                this.props.onLoginValueChange({
                  prop: 'password',
                  value
                })
              }
              onFocus={() => this.setState({ passwordError: '' })}
              onBlur={this.renderPasswordError}
            />
          </CardSection>
          <CardSection>
            <Button
              title="Iniciar Sesión"
              loading={this.props.loadingLogin}
              onPress={this.onButonPressHandler.bind(this)}
            />
          </CardSection>
          <Divider
            style={{
              backgroundColor: 'grey',
              margin: 10
            }}
          />
          <CardSection>
            <Button
              title="Conectar con Google"
              color="#de5145"
              loading={this.props.loadingGoogle}
              onPress={() => this.props.onGoogleLogin()}
              icon={
                <Icon
                  name="google"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
            <Button
              title="Conectar con Facebook"
              color="#4267b2"
              loading={this.props.loadingFacebook}
              onPress={() => this.props.onFacebookLogin()}
              icon={
                <Icon
                  name="facebook-square"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
          </CardSection>
        </View>
        <View style={createAccountContainerStyle}>
          <CardSection>
            <Button
              title="Crear Cuenta"
              type="clear"
              color="white"
              onPress={this.onCreateAcount.bind(this)}
            />
          </CardSection>
        </View>
        {/*}
        <View style={createAccountContainerStyle}>
          <CardSection>
            <Button
              title="Elegir foto"
              type="clear"
              color="white"
              onPress={this.pruebaFoto.bind(this)}
            />
          </CardSection>
            </View>{*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    padding: 15,
    paddingBottom: 10
  },
  logoContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  loginContainerStyle: {
    justifyContent: 'center'
  },
  createAccountContainerStyle: {
    justifyContent: 'flex-end'
  }
});

const mapStateToProps = state => {
  const {
    email,
    password,
    error,
    loadingLogin,
    loadingFacebook,
    loadingGoogle,
    disabledLogin,
    disabledFacebook,
    disabledGoogle,
    disabledCreateAccount
  } = state.auth;

  return {
    email,
    password,
    error,
    loadingLogin,
    loadingFacebook,
    loadingGoogle,
    disabledLogin,
    disabledFacebook,
    disabledGoogle,
    disabledCreateAccount
  };
};

export default connect(
  mapStateToProps,
  { onLogin, onGoogleLogin, onFacebookLogin, onLoginValueChange }
)(LoginForm);
