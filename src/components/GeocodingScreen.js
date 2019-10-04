import React from 'react';
import { Text, Button, Platform, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default class GeocodingScreen extends React.Component {
  state = {
    calle: 'San Jerónimo',
    numero: 50,
    barrio: 'Centro',
    ciudad: 'Cordoba',
    pais: 'Argentina',
    latitude: -31.417378,
    longitude: -64.18384
  };

  async componentDidMount() {
    const {
      calle,
      numero,
      barrio,
      ciudad
    } = this.props.navigation.state.params.address;

    this.setState({ calle, numero, barrio, ciudad });
    const address = `${calle} ${numero}, ${barrio}, ${ciudad}, Argentina`;
    console.log('address geocode: ', address);
    const result = await Location.geocodeAsync(address);
    console.log('result geocode: ', result);

    // this.setState({ latitude, longitude });
  }

  render() {
    const { latitude, longitude } = this.state;
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        onPress={e => alert(e.nativeEvent.coordinate.latitude)}
        onLongPress={e =>
          this.setState({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          })
        }
      >
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          title={'title'}
          description={'description'}
        />
      </MapView>
    );
  }
}

styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0 //Here is the trick
  }
});
