import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CardSection, Button, Input } from './common';
import { validateValueType } from './common/validate';
import {
  onLogin,
  onValueChange,
  onFacebookLogin,
  onGoogleLogin
} from '../actions';

class LoginForm extends Component {
  state = { emailError: ''};
  onButonPressHandler(){
    if(this.renderEmailError()){
      this.props.onLogin({
        email: this.props.email,
        password: this.props.password
    })
  }}
  
  onCreateAcount() {
    
      const navigateAction = NavigationActions.navigate({
      routeName: 'registerForm'
    });

    this.props.navigation.navigate(navigateAction);
  }
  
  renderEmailError = () => {
    if( this.props.email==''){
     this.setState({ emailError: 'Dato requerido' });
     return false;
   }else if (!validateValueType('email', this.props.email)) {
     this.setState({ emailError: 'Formato incorrecto' });
     return false;
   }else {
     this.setState({ emailError: '' });
     return true;
   }
 };
  render() {
    const {
      containerStyle,
      loginContainerStyle,
      createAccountContainerStyle
    } = styles;

    return (
      <View style={containerStyle} >
        <View style={loginContainerStyle} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../assets/icon.png')} style={{ height: 135, width: 135 }} />
          </View>
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
              errorMessage={this.props.error}
              onChangeText={value =>
                this.props.onValueChange({
                  prop: 'password',
                  value
                })
              }
            />
          </CardSection>
          <CardSection>
            <Button
              title="Iniciar Sesion"
              loading={this.props.loadingLogin}
              onPress={this.onButonPressHandler.bind(this)}
            />
          </CardSection>
          <Divider
            style={{
              backgroundColor: 'grey',
              margin: 12
            }}
          />
          <CardSection>
            <Button
              title="Conectar con Google"
              color='#de5145'
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
              color='#4267b2'
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'stretch',
    padding: 15
  },
  loginContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
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
  { onLogin, onGoogleLogin, onFacebookLogin, onValueChange }
)(LoginForm);
