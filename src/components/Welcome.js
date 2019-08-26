import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { CardSection, Button } from './common';

class Welcome extends Component {
  onButtonPressHandler() {
    this.props.navigation.navigate('commerceRegisterProfile');
  }

  onButtonPressHandlerBack() {
    this.props.navigation.navigate('tabs');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CardSection>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>
            Bienvenido!! Registra tu Negocio
          </Text>
        </CardSection>
        <CardSection>
          <Button
            title="Continuar"
            onPress={this.onButtonPressHandler.bind(this)}
          />
        </CardSection>
        <CardSection>
          <Button
            title="Volver"
            onPress={this.onButtonPressHandlerBack.bind(this)}
          />
        </CardSection>
      </View>
    );
  }
}

export default Welcome;
