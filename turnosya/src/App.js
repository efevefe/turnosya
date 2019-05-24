import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as firebase from 'firebase';
import 'firebase/firestore';
import reducers from './reducers';
import { Header } from './components/common';
import ServiceForm from './components/ServiceForm';
import ReduxThunk from 'redux-thunk';

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

    firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Header headerText='TurnosYa' />
          <ServiceForm />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
});
