import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import { CardSection, Button, Input } from './common';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onLogin, onLoginFacebook, onValueChange } from '../actions';
import { NavigationActions } from 'react-navigation';

class LoginForm extends Component {
  onCreateAcount() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'registerForm'
    });

    this.props.navigation.navigate(navigateAction);
  }

  render() {
    const { containerStyle, loginContainerStyle, createAccountContainerStyle } = styles;

    return (
      <View style={containerStyle} >
        <View style={loginContainerStyle} >
          <CardSection>
            <Input
              placeholder="E-Mail"
              autoCapitalize='none'
              keyboardType='email-address'
              value={this.props.email}
              onChangeText={value =>
                this.props.onValueChange({
                  prop: 'email',
                  value
                })
              }
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
              loading={this.props.loading}
              onPress={() =>
                this.props.onLogin({
                  email: this.props.email,
                  password: this.props.password
                })
              }
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
              loading={this.props.loading}
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
              loading={this.props.loading}
              onPress={() =>
                this.props.onLoginFacebook()
              }
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
              color='white'
              onPress={this.onCreateAcount.bind(this)}
            />
          </CardSection>
        </View>
      </View>
    );
  }
}

const styles = {
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
};

const mapStateToProps = state => {
  const { email, password, loading, error } = state.auth;

  return { email, password, loading, error };
};

export default connect(
  mapStateToProps,
  { onLogin, onLoginFacebook, onValueChange }
)(LoginForm);
