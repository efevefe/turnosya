import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, Button, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection } from './common';
import { MAIN_COLOR } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

class LoginForm extends Component {
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
            />
          </CardSection>
          <CardSection>
            <Input placeholder="Contraseña" />
          </CardSection>
          <CardSection>
            <Button
              buttonStyle={styles.loginButtonStyle}
              title="Iniciar Sesion"
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

export default LoginForm;
