import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Divider } from 'react-native-elements';
import { View } from 'react-native';
import { CardSection } from './common';
import { MAIN_COLOR } from '../constants';
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
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          alignSelf: 'stretch',
          padding: 15
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            // alignSelf: 'stretch',
            marginBottom: 20
          }}
        >
          <CardSection>
            <Input
              style={{ textAlign: 'center' }}
              placeholder="Correo electrónico"
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
              value={this.props.password}
              onChangeText={value =>
                this.props.onValueChange({
                  prop: 'password',
                  value
                })
              }
              errorMessage={this.props.error}
              secureTextEntry
            />
          </CardSection>
          <CardSection>
            <Button
              buttonStyle={styles.loginButtonStyle}
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
              margin: 15
            }}
          />
          <CardSection>
            <Button
              buttonStyle={styles.googleButtonStyle}
              title="Gmail"
              icon={
                <Icon
                  name="google"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
              }
            />
            <Button
              buttonStyle={styles.facebookButtonStyle}
              title="Facebook"
              loading={this.props.loading}
              onPress={() =>
                this.props.onLoginFacebook()
              }
              icon={
                <Icon
                  name="facebook-square"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
              }
            />
          </CardSection>
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <CardSection>
            <Button
              buttonStyle={styles.createButtonStyle}
              title="Crear cuenta"
              type="clear"
              titleStyle={{ color: MAIN_COLOR }}
              onPress={this.onCreateAcount.bind(this)}
            />
          </CardSection>
        </View>
      </View>
    );
  }
}

const styles = {
  loginButtonStyle: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: MAIN_COLOR
  },
  facebookButtonStyle: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#4267b2'
  },
  googleButtonStyle: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#de5145'
  },
  createButtonStyle: {
    padding: 10,
    margin: 10
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
