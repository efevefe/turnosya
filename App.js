import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import { Root } from 'native-base';
import MainNavigation from './src/navigation/MainNavigation';
import reducers from './src/reducers';
import { MAIN_COLOR } from './src/constants';
import getEnvVars from './environment';

const { firebaseConfig } = getEnvVars();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

console.disableYellowBox = true;

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
          <View style={styles.container}><MainNavigation /></View>
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
