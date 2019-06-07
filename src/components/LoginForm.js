import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, Button, Divider } from 'react-native-elements';
import { View, Text } from 'react-native';
import { CardSection } from './common';
import { MAIN_COLOR } from '../constants';

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
        <CardSection>
          <Input />
        </CardSection>
        <CardSection>
          <Input />
        </CardSection>
        <CardSection>
          <Button buttonStyle={styles.buttonStyle} title="Iniciar Sesion" />
        </CardSection>
        <Divider style={{ backgroundColor: 'grey' }} />
        <CardSection>
          <Button buttonStyle={styles.buttonStyle} title="Iniciar Sesion" />
        </CardSection>
        <CardSection>
          <Button buttonStyle={styles.buttonStyle} title="Iniciar Sesion" />
        </CardSection>
      </View>
    );
  }
}

const styles = {
  buttonStyle: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: MAIN_COLOR
  }
};

export default LoginForm;
