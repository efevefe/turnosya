import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fab } from 'native-base';
import { MAIN_COLOR } from '../constants';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import LocationMessages from './common/LocationMessages';
import { connect } from 'react-redux';
import { onLocationChange } from '../actions';

class GeocodingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title')
    };
  };

  state = { locationAsked: false };

  componentDidMount() {
    const address = this.setStreetString(); //se puede definir en el constructor y lo de abajo una funcion aparte
    this.getLocationAndLongitudeFromString(address);
  }

  setStreetString = () => {
    const { street, streetNumber, city } = this.props;

    let address = `${street !== '' ? street : ''}${
      streetNumber !== '' ? ' ' + streetNumber : ''
    }`;

    address = `${address !== '' ? address + ', ' : ''}${
      city !== '' ? city : ''
    }`;

    if (address === '') {
      address = 'Córdoba, Argentina';
    }

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
      // ciudad
    }
  };

  getAddressFromLatAndLong = async ({ latitude, longitude }) => {
    const [addresResult] = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    const { street, city, country } = addresResult;

    const location = {
      latitude,
      longitude,
      street,
      streetNumber: addresResult.name.replace(street, ''),
      city,
      country
    };

    this.props.onLocationChange({ location });
  };

  renderLocationMessage = () => {
    if (this.state.locationAsked) {
      // this.setState({ locationAsked: false }); //ver la forma de poner este asked en false
      return <LocationMessages />;
    }
  };

  render() {
    const { latitude, longitude, street, streetNumber } = this.props;
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          style={{ flex: 1 }}
          ref={ref => (this.map = ref)}
          initialRegion={this.region}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          onRegionChangeComplete={region => (this.region = region)}
          animateToRegion={{ region: this.region, duration: 3000 }}
          onLongPress={e =>
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
            onDragEnd={e =>
              this.getAddressFromLatAndLong({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
              })
            }
          />
        </MapView>
        {this.renderLocationMessage()}
        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.setState({ locationAsked: true })}
        >
          <Ionicons name="md-locate" />
        </Fab>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    street,
    streetNumber,
    city,
    country,
    latitude,
    longitude
  } = state.locationData;

  return { street, streetNumber, city, country, latitude, longitude };
};

export default connect(
  mapStateToProps,
  { onLocationChange }
)(GeocodingScreen);
