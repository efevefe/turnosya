import React from 'react';
import firebase from 'firebase';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  componentWillMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyDBtphHkP2FAebuiBNkmGxLhxlPbHe10VI",
      authDomain: "proyecto-turnosya.firebaseapp.com",
      databaseURL: "https://proyecto-turnosya.firebaseio.com",
      projectId: "proyecto-turnosya",
      storageBucket: "proyecto-turnosya.appspot.com",
      messagingSenderId: "425889819253",
      appId: "1:425889819253:web:22821710c1e913a5"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>TurnosYa!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
