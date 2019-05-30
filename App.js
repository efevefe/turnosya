import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import reducers from './src/reducers';
import { Header } from './src/components/common';
import ServiceForm from './src/components/ServiceForm';
import ServicesList from './src/components/ServicesList';
import ReduxThunk from 'redux-thunk';

var firebaseConfig = {
  apiKey: 'AIzaSyDBtphHkP2FAebuiBNkmGxLhxlPbHe10VI',
  authDomain: 'proyecto-turnosya.firebaseapp.com',
  databaseURL: 'https://proyecto-turnosya.firebaseio.com',
  projectId: 'proyecto-turnosya',
  storageBucket: 'proyecto-turnosya.appspot.com',
  messagingSenderId: '425889819253',
  appId: '1:425889819253:web:22821710c1e913a5',
};

firebase.initializeApp(firebaseConfig);

//logueo para facilitar las pruebas
firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');

console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Header headerText="TurnosYa" />
          <ServicesList />
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
