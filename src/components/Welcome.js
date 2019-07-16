import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { CardSection, Button, Input } from './common';

class Welcome extends Component {
  onButtonPressHandler() {
    this.props.navigation.navigate('commerceRegisterProfile');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CardSection>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>
            Bienvenido Registra tu Negocio
          </Text>
        </CardSection>
        <CardSection>
          <Button
            title="Continuar"
            onPress={this.onButtonPressHandler.bind(this)}
          />
        </CardSection>
      </View>
    );
  }
}

export default Welcome;
