import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { Divider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CardSection, Button, Input, Menu, MenuItem, Toast } from './common';
import { validateValueType } from '../utils';
import { onLogin, onLoginValueChange, onFacebookLogin, onGoogleLogin, onSendPasswordResetEmail } from '../actions';

const iconSize = Math.round(Dimensions.get('window').height) * 0.22;

class LoginForm extends Component {
  state = { emailError: '', passwordError: '', resetPasswordModal: false };

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
    if (!this.props.email) {
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
    if (!this.props.password) {
      this.setState({ passwordError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('password', this.props.password)) {
      this.setState({
        passwordError: 'Usuario o contraseña incorrectos'
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

  renderResetUserPasswordModal = () => {
    // ventana de recuperacion de contraseña
    return (
      <Menu
        title="Enviar correo de recuperación:"
        onBackdropPress={() => this.setState({ resetPasswordModal: false })}
        isVisible={this.state.resetPasswordModal}
      >
        <CardSection style={styles.resetPasswordInputContainer}>
          <Input
            label="E-Mail"
            placeholder="E-mail de la cuenta"
            autoCapitalize="none"
            keyboardType="email-address"
            color="black"
            value={this.props.email}
            errorMessage={this.props.error || this.state.emailError}
            onChangeText={email => this.props.onLoginValueChange({ email })}
            onFocus={() => {
              this.setState({ emailError: '' });
              this.props.onLoginValueChange({ error: '' });
            }}
          />
        </CardSection>
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem
          title="Enviar correo"
          icon="md-mail-open"
          loadingWithText={this.props.sendingEmail}
          onPress={this.onSendPasswordResetEmailPress}
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem title="Cancelar" icon="md-close" onPress={() => this.setState({ resetPasswordModal: false })} />
      </Menu>
    );
  };

  onSendPasswordResetEmailPress = async () => {
    if (this.renderEmailError()) {
      const success = await this.props.onSendPasswordResetEmail(this.props.email);

      if (success) {
        Toast.show({
          text: 'El correo de recuperacion se envió correctamente'
        });
        this.setState({ resetPasswordModal: false });
      }
    }
  };

  render() {
    const { containerStyle, logoContainerStyle, loginContainerStyle, createAccountContainerStyle } = styles;

    return (
      <View style={containerStyle}>
        <StatusBar barStyle="dark-content" />
        <View style={logoContainerStyle}>
          <Image source={require('../../assets/turnosya-red.png')} style={{ height: iconSize, width: iconSize }} />
        </View>
        <View style={loginContainerStyle}>
          <CardSection>
            <Input
              placeholder="E-Mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.props.email}
              errorMessage={this.state.emailError}
              onChangeText={email => this.props.onLoginValueChange({ email })}
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection>

          <CardSection>
            <Input
              placeholder="Contraseña"
              password
              autoCapitalize="none"
              value={this.props.password}
              errorMessage={this.state.passwordError || this.props.error}
              onChangeText={password => this.props.onLoginValueChange({ password })}
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

          <Button
            title="Olvidé mi contraseña"
            type="clear"
            color="white"
            titleStyle={styles.resetPasswordTitleStyle}
            buttonStyle={styles.resetPasswordButtonStyle}
            onPress={() => this.setState({ resetPasswordModal: true })}
          />

          <Divider
            style={{
              backgroundColor: 'grey',
              margin: 10,
              marginTop: 12,
              marginBottom: 12
            }}
          />

          <CardSection>
            <Button
              title="Conectar con Google"
              color="#de5145"
              loading={this.props.loadingGoogle}
              buttonStyle={styles.buttonStyle}
              onPress={() => this.props.onGoogleLogin()}
              icon={<Icon name="google" size={20} color="white" style={{ marginRight: 10 }} />}
            />
          </CardSection>

          <CardSection>
            <Button
              title="Conectar con Facebook"
              color="#4267b2"
              loading={this.props.loadingFacebook}
              buttonStyle={styles.buttonStyle}
              onPress={() => this.props.onFacebookLogin()}
              icon={<Icon name="facebook-square" size={20} color="white" style={{ marginRight: 10 }} />}
            />
          </CardSection>
        </View>
        <View style={createAccountContainerStyle}>
          <Button
            title="Crear Cuenta"
            type="clear"
            color="white"
            buttonStyle={styles.buttonStyle}
            onPress={this.onCreateAcount.bind(this)}
          />
        </View>

        {this.renderResetUserPasswordModal()}
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
    paddingTop: iconSize / 3
  },
  loginContainerStyle: {
    justifyContent: 'flex-end'
  },
  createAccountContainerStyle: {
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    marginVertical: 4
  },
  resetPasswordTitleStyle: {
    fontSize: 14,
    color: 'grey'
  },
  resetPasswordButtonStyle: {
    margin: 0,
    padding: 0,
    alignSelf: 'center'
  },
  resetPasswordInputContainer: {
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10
  }
});

const mapStateToProps = state => {
  const { email, password, error, loadingLogin, loadingFacebook, loadingGoogle, sendingEmail } = state.auth;

  return {
    email,
    password,
    error,
    loadingLogin,
    loadingFacebook,
    loadingGoogle,
    sendingEmail
  };
};

export default connect(mapStateToProps, {
  onLogin,
  onGoogleLogin,
  onFacebookLogin,
  onLoginValueChange,
  onSendPasswordResetEmail
})(LoginForm);
