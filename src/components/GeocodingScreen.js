import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fab } from 'native-base';
import { MAIN_COLOR } from '../constants';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default class GeocodingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title')
    };
  };

  state = {
    address: '',
    street: 'San Jerónimo',
    streetNumber: 50,
    region: 'Centro',
    city: 'Cordoba',
    country: 'Argentina',
    latitude: 0,
    longitude: 0
  };

  componentDidMount() {
    const address = this.setStreetString(); //se puede definir en el constructor y lo de abajo una funcion aparte
    this.getLocationAndLongitudeFromString(address);
  }

  setStreetString = () => {
    const {
      street,
      streetNumber,
      region,
      city
    } = this.props.navigation.state.params.address;

    let address = `${street !== '' ? street : ''}${
      streetNumber !== '' ? ' ' + streetNumber : ''
    }`;

    address = `${address !== '' ? address + ', ' : ''}${
      region !== '' ? region : ''
    }`;

    address = `${address !== '' ? address + ', ' : ''}${
      city !== '' ? city : ''
    }`;

    if (address === '') {
      address = 'Córdoba, Argentina';
    }

    this.setState({ address, street, streetNumber, region, city });

    return address;
  };

  getLocationAndLongitudeFromString = async string => {
    const [latLongResult] = await Location.geocodeAsync(string);

    if (latLongResult !== undefined) {
      const { latitude, longitude } = latLongResult;
      this.getAddressFromLatAndLong({ latitude, longitude });
    } else {
      // cuando la dirección que se dió no se encontró ....
      // probar agregando 'calle' o 'boulevard'
      // calle, ciudad
      // calle, barrio, ciudad,
      // barrio, ciudad
      // ciudad
    }
  };

  getAddressFromLatAndLong = async ({ latitude, longitude }) => {
    const [addresResult] = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    const { street, region, city, country } = addresResult;

    this.setState({
      latitude,
      longitude,
      street,
      streetNumber: addresResult.name.replace(street, ''),
      region,
      city,
      country
    });
  };

  render() {
    const { latitude, longitude, street, streetNumber } = this.state;

    return (
      <View style={{ flex: 1, position: 'relative' }}>
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
          onLongPress={async e =>
            this.getAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        >
          <MapView.Marker
            coordinate={{ latitude, longitude }}
            title={`${street} ${streetNumber}`}
            draggable
          />
        </MapView>

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => console.log('perrrriii')}
        >
          <Ionicons name="md-locate" />
        </Fab>
      </View>
    );
  }
}
