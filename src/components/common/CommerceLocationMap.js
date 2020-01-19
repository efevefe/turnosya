import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Platform } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { onLocationValueChange } from '../../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';
import LocationMessages from './LocationMessages';
import { Toast } from '.';
import {
  getAddressFromLatAndLong,
  getLatitudeAndLongitudeFromString
} from '../../utils';

class CommerceLocationMap extends React.Component {
  state = {
    defaultAddress: 'Córdoba, Argentina',
    completeAddress: '',
    locationAsked: false,
    draggable: !this.props.navigation
  };

  componentDidMount() {
    if (this.props.findAddress) {
      this.onStringSearch(this.setAddressString());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.locationAsked &&
      prevProps.userLocation !== this.props.userLocation
    ) {
      this.setState({ locationAsked: false });
    }

    if (this.props.onProvinceNameChange) {
      if (prevProps.provinceName !== this.props.provinceName) {
        this.props.onProvinceNameChange(this.props.provinceName);
      }
    }
  }

  setAddressString = () => {
    const { address, city, provinceName } = this.props;

    /* 
    Se le agrega 'Calle' antes para que el mapa lo busque mejor. Sirve por mas que ya se le haya puesto 'Calle' 
    en la prop, y por mas que la calle sea una Avenida, Boulevard, pje ..porque después el mapa busca la dirección,
    y lo cambia con el nombre correcto
    */
    let newAddress = `${address !== '' ? `Calle ${address}, ` : ''}`;

    newAddress += `${city !== '' ? city + ', ' : ''}`;

    newAddress += `${provinceName !== '' ? provinceName + ', ' : ''}`;

    newAddress += 'Argentina'; // gets error when address is from other country

    if (newAddress === 'Argentina') {
      newAddress = this.state.defaultAddress;
    }

    this.setState({ completeAddress: newAddress });

    return newAddress;
  };

  onStringSearch = async string => {
    try {
      const [latLongResult] = await getLatitudeAndLongitudeFromString(
        string ? string : this.state.completeAddress
      );

      if (latLongResult !== undefined) {
        const { latitude, longitude } = latLongResult;
        this.updateAddressFromLatAndLong({ latitude, longitude });
      } else {
        this.setState({
          completeAddress: this.state.completeAddress.replace('Calle', '')
        });
        Toast.show({
          text:
            'No se han encontrado resultados, intente modificar la dirección.'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  updateAddressFromLatAndLong = async ({ latitude, longitude }) => {
    try {
      const [addresResult] = await getAddressFromLatAndLong({
        latitude,
        longitude
      });
      const { name, street, city, region, country } = addresResult;

      const address = Platform.OS === 'ios' ? name : `${street} ${name}`;

      const location = {
        latitude,
        longitude,
        address,
        provinceName: region,
        city,
        country
      };

      this.setState({
        completeAddress: `${address}, ${city}, ${region}, ${country}`
      });

      this.props.onLocationValueChange(location);
    } catch (e) {
      console.error(e);
    }
  };

  calculateMarkersRegion = markers => {
    let minLat, maxLat, minLng, maxLng;

    minLat = markers[0].latitude;
    maxLat = markers[0].latitude;
    minLng = markers[0].longitude;
    maxLng = markers[0].longitude;

    markers.forEach(marker => {
      minLat = Math.min(minLat, marker.latitude);
      maxLat = Math.max(maxLat, marker.latitude);
      minLng = Math.min(minLng, marker.longitude);
      maxLng = Math.max(maxLng, marker.longitude);
    });

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;

    const deltaLat = maxLat - minLat + 0.02;
    const deltaLng = maxLng - minLng + 0.08;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat,
      longitudeDelta: deltaLng
    };
  };

  mapRegion = () => {
    const arrayOfMarkers = [];
    if (this.props.userLocation.latitude) {
      user = {
        latitude: this.props.userLocation.latitude,
        longitude: this.props.userLocation.longitude
      };

      arrayOfMarkers.push(user);
    }

    if (this.props.latitude) {
      selectedLocation = {
        latitude: this.props.latitude,
        longitude: this.props.longitude
      };

      arrayOfMarkers.push(selectedLocation);
    }

    return arrayOfMarkers.length
      ? this.calculateMarkersRegion(arrayOfMarkers)
      : { latitudeDelta: 0.01, longitudeDelta: 0.01 };
  };

  renderUserMarker = () => {
    const { latitude, longitude, address } = this.props.userLocation;

    if (latitude && longitude && address) {
      return (
        <MapView.Marker
          coordinate={{
            latitude,
            longitude
          }}
          title={address}
          pinColor={'#1589FF'}
        >
          {/* <Image
            source={require('../../../assets/turnosya-grey.png')}
            style={{ height: 30, width: 30 }}
          /> */}
        </MapView.Marker>
      );
    }
  };

  renderPointerMarker = () => {
    const { latitude, longitude, address } = this.props;

    if (latitude && longitude && address) {
      return (
        <MapView.Marker
          coordinate={{
            latitude,
            longitude
          }}
          draggable={this.state.draggable}
          title={address}
          onDragEnd={e =>
            this.updateAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
          pinColor={MAIN_COLOR}
        />
      );
    }
  };

  renderSearchBar = () => {
    if (this.props.searchBar) {
      const validAddress =
        this.state.completeAddress !== 'Córdoba, Argentina'
          ? this.state.completeAddress
          : '';

      return (
        <View style={mainContainer}>
          <SearchBar
            {...this.props}
            platform="android"
            placeholder="San Martín 30, Córdoba, Argentina"
            onChangeText={text => this.setState({ completeAddress: text })}
            onCancel={() => this.setState({ completeAddress: '' })}
            value={validAddress}
            containerStyle={searchBarContainer}
            inputStyle={searchInput}
            searchIcon={{ color: MAIN_COLOR }}
            cancelIcon={{ color: MAIN_COLOR }}
            clearIcon={{ color: MAIN_COLOR }}
            onEndEditing={e => this.onStringSearch(e.nativeEvent.text)}
          />
        </View>
      );
    }
  };

  renderLocationMessage = () => {
    if (this.state.locationAsked) return <LocationMessages />;
  };

  render() {
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          {...this.props}
          style={{ flex: 1 }}
          ref={ref => (this.map = ref)}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.region}
          region={this.mapRegion()}
          onRegionChangeComplete={region => (this.region = region)}
          animateToRegion={{ region: this.region, duration: 3000 }}
          onLongPress={e => {
            if (this.state.draggable) {
              this.updateAddressFromLatAndLong({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
              });
            }
          }}
        >
          {this.renderUserMarker()}
          {this.renderPointerMarker()}
        </MapView>
        {this.renderLocationMessage()}
        {this.renderSearchBar()}

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

const { mainContainer, searchBarContainer, searchInput } = StyleSheet.create({
  mainContainer: {
    height: NAVIGATION_HEIGHT + 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    position: 'absolute'
  },
  searchBarContainer: {
    alignSelf: 'stretch',
    height: NAVIGATION_HEIGHT,
    paddingTop: 4,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  searchInput: {
    marginTop: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 0
  }
});

const mapStateToProps = state => {
  const {
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude,
    userLocation
  } = state.locationData;

  return {
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude,
    userLocation
  };
};

export default connect(mapStateToProps, {
  onLocationValueChange
})(CommerceLocationMap);
