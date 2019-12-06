import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Platform, Image, Text } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { onLocationChange, onCourtReservationValueChange } from '../../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';
import LocationMessages from './LocationMessages';
import { Toast } from '.';
import {
  getAddressFromLatAndLong,
  getLatitudeAndLongitudeFromString
} from '../../utils';

class CommercesMap extends React.Component {
  state = {
    defaultAddress: 'Córdoba, Argentina',
    completeAddress: '',
    locationAsked: false,
    userLocationChanged: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.locationAsked &&
      prevProps.userLocation !== this.props.userLocation
    ) {
      this.setState({
        locationAsked: false,
        userLocationChanged: true
      });
    }
  }

  setAddressString = () => {
    const { address, city, provinceName } = this.props.selectedLocation;

    /* 
    Se le agrega 'Calle' antes para que el mapa lo busque mejor. Sirve por mas que ya se le haya puesto 'Calle' 
    en la prop, y por mas que la calle sea una Avenida, Boulevard, pje ..porque después el mapa busca la dirección,
    y lo cambia con el nombre correcto
    */
    let newAddress = `${address !== '' ? `Calle ${address}, ` : ''}`;

    newAddress += `${city !== '' ? city + ', ' : ''}`;

    newAddress += `${provinceName !== '' ? provinceName + ', ' : ''}`;

    newAddress += 'Argentina'; // gets error when addres is from other country

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

    this.setState({ userLocationChanged: false });
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
        completeAddress: `${address}, ${city}, ${region}, ${country}`,
        userLocationChanged: false
      });

      this.props.onLocationChange({
        prop: 'selectedLocation',
        value: location
      });
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
    let region = {};
    if (this.state.userLocationChanged) {
      const { latitude, longitude } = this.props.userLocation;

      region = { latitude, longitude };
    } else if (this.props.markers.length > 0) {
      return this.calculateMarkersRegion(this.props.markers);
    } else if (
      this.props.selectedLocation.latitude &&
      this.props.selectedLocation.longitude
    ) {
      const { latitude, longitude } = this.props.selectedLocation;

      region = { latitude, longitude };
    }

    return { latitudeDelta: 0.01, longitudeDelta: 0.01, ...region };
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
    const { latitude, longitude, address } = this.props.selectedLocation;
    if (latitude && longitude && address) {
      return (
        <MapView.Marker
          coordinate={{
            latitude,
            longitude
          }}
          draggable
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

  renderCommercesMarkers = () => {
    // TODO: give it a different style to differentiate it with user's and current pointer marker
    if (this.props.markers && this.props.markers.length) {
      return this.props.markers.map(marker => (
        <MapView.Marker
          key={marker.objectID}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          title={marker.name}
          pinColor={'black'}
        >
          <MapView.Callout
            tooltip
            onPress={() => this.onMarkerTitlePress(marker)}
          >
            <Text>{marker.name}</Text>
          </MapView.Callout>
        </MapView.Marker>
      ));
    }
  };

  onMarkerTitlePress = marker => {
    this.props.onCourtReservationValueChange({
      prop: 'commerce',
      value: marker
    });

    this.props.navigation.navigate('commerceProfileView');
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

  renderFabLocation = () => {
    if (this.props.longPressAllowed) {
      return (
        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.setState({ locationAsked: true })}
        >
          <Ionicons name="md-locate" />
        </Fab>
      );
    }
  };

  onLongPressHandler = e => {
    if (this.props.selectedLocation.latitude || this.props.longPressAllowed)
      this.updateAddressFromLatAndLong({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      });
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
          onLongPress={this.onLongPressHandler}
        >
          {this.renderUserMarker()}
          {this.renderPointerMarker()}
          {this.renderCommercesMarkers()}
        </MapView>
        {this.renderLocationMessage()}
        {this.renderSearchBar()}
        {this.renderFabLocation()}
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
  const { userLocation, selectedLocation } = state.locationData;

  const { markers } = state.commercesList;

  return {
    userLocation,
    selectedLocation,
    markers
  };
};

export default connect(mapStateToProps, {
  onLocationChange,
  onCourtReservationValueChange
})(CommercesMap);
