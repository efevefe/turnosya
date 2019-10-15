import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Button } from './common';
import { MAIN_COLOR } from '../constants';

const logoSize = Math.round(Dimensions.get('window').width) / 2.2;

class Welcome extends Component {
  render() {
    return (
      <View style={styles.containerStyle}>
        <View style={styles.logoContainerStyle}>
          <Image
            source={require('../../assets/turnosya-white.png')}
            style={{ height: logoSize, width: logoSize, marginBottom: 50 }}
            fadeDuration={0}
          />
          <CardSection>
            <Text style={styles.textStyle}>
              ¡Bienvenido, registrá tu negocio!
            </Text>
          </CardSection>
          <CardSection style={{ paddingLeft: 25, paddingRight: 25 }}>
            <Button
              title="Continuar"
              color="white"
              titleStyle={{ color: MAIN_COLOR }}
              onPress={() =>
                this.props.navigation.navigate('commerceRegisterProfile')
              }
            />
          </CardSection>
        </View>
        <View style={styles.backContainerStyle}>
          <CardSection>
            <Button
              title="Volver"
              type="clear"
              titleStyle={{ color: 'white' }}
              icon={
                <Ionicons
                  name="ios-arrow-back"
                  size={30}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
              onPress={() => this.props.navigation.navigate('tabs')}
            />
          </CardSection>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR
  },
  logoContainerStyle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 19,
    color: 'white'
  },
  backContainerStyle: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10
  }
});

export default Welcome;
