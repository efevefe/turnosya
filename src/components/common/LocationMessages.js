import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';
import {
  getCurrentPosition,
  getPermissionLocationStatus,
  openGPSAndroid,
  openSettingIos
} from '../../utils';

class LocationMessages extends Component {
  state = {
    permisionStatus: null,
    location: null
  };

  async componentDidMount() {
    this.setState({ permisionStatus: await getPermissionLocationStatus() });
  }

  renderLocation = () => {
    let text;
    const plat = Platform.OS;
    if (plat === 'ios') {
      switch (this.state.permisionStatus) {
        case '1':
          // this.setState({ location: await getCurrentPosition() });
          text = 'La localizacion es: jjj';
          break;
        case '2':
          openSettingIos();
          text = 'los permisos no estas aceptados';
          break;
        case '3':
          text = 'prende el gps';
          break;
        default:
          text = 'Waiting..';
          break;
      }
    } else {
      switch (this.state.permisionStatus) {
        case '1':
          // this.setState({ location: await getCurrentPosition() });
          text = 'La localizacion es: jjj';
          break;
        case '2':
          text = 'los permisos no estas aceptados';
          break;
        case '3':
          // openGPSAndroid();
          text = 'prende el gps';
          break;
        default:
          text = 'Waiting..';
          break;
      }
    }

    return text;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.renderLocation()}</Text>
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

export { LocationMessages };
