import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import { MAIN_COLOR } from './src/constants';
import { Spinner } from './src/components/common';
import MainNavigation from './src/navigation/MainNavigation';
import GuestNavigation from './src/navigation/GuestNavigation';
import reducers from './src/reducers';
import LoadingScreen from './src/components/LoadingScreen';

var firebaseConfig = {
  apiKey: 'AIzaSyDBtphHkP2FAebuiBNkmGxLhxlPbHe10VI',
  authDomain: 'proyecto-turnosya.firebaseapp.com',
  databaseURL: 'https://proyecto-turnosya.firebaseio.com',
  projectId: 'proyecto-turnosya',
  storageBucket: 'proyecto-turnosya.appspot.com',
  messagingSenderId: '425889819253',
  appId: '1:425889819253:web:22821710c1e913a5'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

console.disableYellowBox = true;

// firebase.auth().signInWithEmailAndPassword('test@test.com', 'password123');
// firebase.auth().signOut();

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends React.Component {
  state = { logged: false, screenLoading: true };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ logged: true, screenLoading: false });
      } else {
        this.setState({ logged: false, screenLoading: false });
      }
    });
  }

  renderNavigation = () => {
    const { screenLoading, logged } = this.state;

    if (screenLoading) {
      return <LoadingScreen />;
    } else {
      if (logged) {
        return <MainNavigation />;
      } else {
        return <GuestNavigation />;
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>{this.renderNavigation()}</View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  }
});

export default App;
