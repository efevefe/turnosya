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
    latitude: 0,
    longitude: 0
  };

  async componentDidMount() {
    const {
      calle,
      numero,
      barrio,
      ciudad
    } = this.props.navigation.state.params.address;

    //validar cuando vienen vacios o no completos
    this.setState({ calle, numero, barrio, ciudad });
    const address = `${calle} ${numero}, ${barrio}, ${ciudad}, Argentina`;
    const result = await Location.geocodeAsync(address);
    //ver bien este tema de cuando no encuentra nada
    if (result.length > 0) {
      const latitude = result[0].latitude;
      const longitude = result[0].longitude;

      this.setState({ latitude, longitude });
    }
  }

  render() {
    const { latitude, longitude, calle, numero } = this.state;
    return (
      <MapView
        style={{ flex: 1 }}
        ref={ref => (this.map = ref)}
        initialRegion={this.region}
        region={{
          latitude: latitude ? latitude : -31.417378,
          longitude: longitude ? longitude : -64.18384,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        onRegionChangeComplete={region => (this.region = region)}
        animateToRegion={{ region: this.region, duration: 3000 }}
        onLongPress={async e => {
          let latitude = e.nativeEvent.coordinate.latitude;
          let longitude = e.nativeEvent.coordinate.longitude;
          let second = await Location.reverseGeocodeAsync({
            latitude,
            longitude
          });
          const number = second[0].name.replace(second[0].street, '');
          this.setState({
            latitude,
            longitude,
            calle: second[0].street,
            barrio: second[0].region,
            ciudad: second[0].city,
            numero: number
          });
        }}
      >
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          title={`${calle} ${numero}`}
          // description={'description'}
        />
      </MapView>
    );
  }
}
