import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import {
  onLocationChange,
  onUserLocationChange,
  onLocationValueChange
} from '../../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';
import LocationMessages from '../common/LocationMessages';
import { Toast } from '../common';
import {
  getAddressFromLatAndLong,
  getLatitudeAndLongitudeFromString
} from '../../utils';

class Map extends React.Component {
  state = {
    defaultAddress: 'Córdoba, Argentina',
    completeAddress: '',
    locationAsked: false,
    userLocationChanged: false
  };

  componentDidMount() {
    this.onStringSearch(this.setAddressString());
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.locationAsked &&
      prevProps.userLocation !== this.props.userLocation
    ) {
      // const { address, provinceName, city, country } = this.props.userLocation;

      this.setState({
        locationAsked: false,
        // completeAddress: `${address}, ${city}, ${provinceName}, ${country}`,
        userLocationChanged: true
      });
    }

    if (prevProps.provinceName !== this.props.provinceName) {
      this.props.onProvinceNameChange &&
        this.props.onProvinceNameChange(this.props.provinceName);
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

    newAddress += 'Argentina'; // gets error when addres is from other country

    if (newAddress === 'Argentina') {
      newAddress = this.state.defaultAddress;
    }

    this.setState({ completeAddress: newAddress });

    return newAddress;
  };

  onStringSearch = async string => {
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
        text: 'No se han encontrado resultados, intente modificar la dirección.'
      });
    }

    this.setState({ userLocationChanged: false });
  };

  updateAddressFromLatAndLong = async ({ latitude, longitude }) => {
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

    this.props.onLocationChange({ location });
  };

  mapRegion = () => {
    let region = {};
    if (this.state.userLocationChanged) {
      const { latitude, longitude } = this.props.userLocation;

      region = { latitude, longitude };
    } else if (this.props.latitude && this.props.longitude) {
      const { latitude, longitude } = this.props;

      region = { latitude, longitude };
    } else {
      region = { latitude: -31.417378, longitude: -64.18384 };
    }

    return { ...region, latitudeDelta: 0.01, longitudeDelta: 0.01 };
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
          pinColor={MAIN_COLOR}
        >
          <Image
            source={require('../../../assets/turnosya-grey.png')}
            style={{ height: 40, width: 40 }}
          />
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
          draggable={this.props.draggable ? this.props.draggable : true}
          title={address}
          onDragEnd={e =>
            this.updateAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
          pinColor={'yellow'}
        />
      );
    }
  };

  renderCommercesMarkers = () => {
    // TODO: give it a different style to differentiate it with user's and current pointer marker
    if (this.props.markers && this.props.markers.length) {
      return this.props.markers.map((marker, index) => (
        <MapView.Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          title={marker.address}
          pinColor={'green'}
        />
      ));
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
          onLongPress={e =>
            this.updateAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        >
          {this.renderUserMarker()}
          {this.renderPointerMarker()}
          {this.renderCommercesMarkers()}
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

  const { markers } = state.commercesList;

  return {
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude,
    userLocation,
    markers
  };
};

export default connect(
  mapStateToProps,
  { onLocationChange, onUserLocationChange, onLocationValueChange }
)(Map);
