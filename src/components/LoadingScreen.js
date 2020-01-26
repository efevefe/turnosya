import React, { Component } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import firebase from 'firebase';
import { MAIN_COLOR } from '../constants';

const logoSize = Math.round(Dimensions.get('window').width) / 2;

class LoadingScreen extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user ? this.props.navigation.navigate('client') : this.props.navigation.navigate('login');
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <View style={styles.logoContainerStyle}>
          <Image
            source={require('../../assets/turnosya-white.png')}
            style={{ height: logoSize, width: logoSize }}
            fadeDuration={0}
          />
          <ActivityIndicator color="white" size="large" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainerStyle: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default LoadingScreen;
