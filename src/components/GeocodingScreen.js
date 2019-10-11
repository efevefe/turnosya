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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.latitude !== this.props.latitude &&
      prevProps.longitude !== this.props.longitude &&
      this.state.locationAsked
    ) {
      this.setState({ locationAsked: false });
      if (this.props.navigation.state.params.callback) {
        this.props.navigation.state.params.callback(this.props.provinceName);
      }
    }
  }

  setStreetString = () => {
    const { street, city, provinceName } = this.props;
    let address = `${street !== '' ? street : ''}`;

    address = `${address !== '' ? address + ', ' : ''}${
      city !== '' ? city : ''
    }`;

    address = `${address !== '' ? address + ', ' : ''}${
      provinceName !== '' ? provinceName : ''
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
    const { name, city, region, country } = addresResult;

    const location = {
      latitude,
      longitude,
      street: name,
      provinceName: region,
      city,
      country
    };

    this.props.onLocationChange({ location });
    if (this.props.navigation.state.params.callback) {
      this.props.navigation.state.params.callback(region);
    }
  };

  renderLocationMessage = () => {
    if (this.state.locationAsked) {
      return <LocationMessages />;
    }
  };

  render() {
    const { latitude, longitude, street } = this.props;

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
            title={street}
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
    city,
    provinceName,
    country,
    latitude,
    longitude
  } = state.locationData;

  return { street, city, provinceName, country, latitude, longitude };
};

export default connect(
  mapStateToProps,
  { onLocationChange }
)(GeocodingScreen);
