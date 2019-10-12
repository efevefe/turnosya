import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import { Root } from 'native-base';
import MainNavigation from './src/navigation/MainNavigation';
import GuestNavigation from './src/navigation/GuestNavigation';
import reducers from './src/reducers';
import LoadingScreen from './src/components/LoadingScreen';
import { MAIN_COLOR } from './src/constants';

import getEnvVars from './environment';
const { firebaseConfig } = getEnvVars();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

console.disableYellowBox = true;

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends React.Component {
  state = { logged: false, screenLoading: true };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user
        ? this.setState({ logged: true, screenLoading: false })
        : this.setState({ logged: false, screenLoading: false });
    });
  }

  renderNavigation = () => {
    const { screenLoading, logged } = this.state;

    if (screenLoading) return <LoadingScreen />;

    return logged ? <MainNavigation /> : <GuestNavigation />;
  };

  render() {
    return (
      <Provider store={store}>
        <Root>
          <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
          <View style={styles.container}>{this.renderNavigation()}</View>
        </Root>
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
