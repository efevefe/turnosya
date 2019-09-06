import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Linking,
  AlertIOS
} from 'react-native';
import { Permissions, Location, Constants, IntentLauncherAndroid } from 'expo';
import {
  getPermissionLocationStatus,
  openGPSAndroid,
  openSettingIos
} from '../utils';

export default class App extends Component {
  state = {
    location: null
  };

  async componentDidMount() {
    this.setState({ location: await getPermissionLocationStatus() });
  }

  renderLocation = () => {
    const plat = Platform.OS;
    if (plat === 'ios') {
      switch (this.state.location) {
        case '1':
          return <Text>dame la posiotion</Text>;
        case '2':
          openSettingIos();
          return <Text>los permisos no estas aceptados</Text>;
        case '3':
          return <Text>prende el gps</Text>;
        default:
          return;
      }
    } else {
      switch (this.state.location) {
        case '1':
          return <Text>dame la posiotion</Text>;
        case '2':
          return <Text>los permisos no estas aceptados</Text>;
        case '3':
          openGPSAndroid();
          return <Text>prende el gps</Text>;
        default:
          return;
      }
    }
  };

  render() {
    let text = 'Waiting..';

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        {this.renderLocation()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  }
});
