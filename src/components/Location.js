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

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null
  };

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'denied') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
      if (Platform.OS === 'ios') {
        const GPSStatus = await Location.getProviderStatusAsync();
        if (GPSStatus.locationServicesEnabled) {
          this.setState({
            errorMessage: 'Permisos APP'
          });
        } else {
          this.setState({
            errorMessage: 'GPSSS'
          });
          AlertIOS.alert(
            'Activa la localización para tener una mejor experiencia',
            'Dirigete a Ajustes > Privacidad > Localizacion',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'Configuracion',
                onPress: () => Linking.openURL('App-Prefs:root=Privacy')
                // onPress: () => Linking.openURL('app-settings:')
              }
            ]
          );
        }
      }
    } else {
      if (Platform.OS === 'android') {
        const GPSStatus = await Location.getProviderStatusAsync();
        if (GPSStatus.gpsAvailable && GPSStatus.locationServicesEnabled) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });

          // location = Es un objeto. Tiene datos como:
          //     coords  {
          //        accuracy --> ,
          //        altitude --> ,
          //        heading --> ,
          //        latitude --> ,
          //        longitude --> ,
          //        sped -->
          //      }
          //    mocked -->
          //    timestamp -->

          // let moreData = await Location.reverseGeocodeAsync({
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude
          // });
          // moreData = Es un array. Agrega datos como:
          //     city --> Córdoba,
          //     street --> null,
          //     region --> Córdoba,
          //     postalCode --> null,
          //     country --> Argentina,
          //     isoCountryCode --> AR,
          //     name --> C1662
          this.setState({ location });
        } else {
          // no te lo deberia abrir de una. Hay que ver como reacciona este metodo en ios
          IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
          ).then(async () => {
            const GPSStatus = await Location.getProviderStatusAsync();
            if (GPSStatus.gpsAvailable) {
              const location = await Location.getCurrentPositionAsync({});
              this.setState({ location });
            } else {
              this.setState({
                errorMessage: 'Permission to access location was denied'
              });
            }
          });
        }
      } else {
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
      }
    }
  };

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
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
