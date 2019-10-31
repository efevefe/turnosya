import React from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { View, StyleSheet, Platform } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { onLocationChange, onLocationValueChange } from '../../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';
import LocationMessages from '../common/LocationMessages';
import { Toast } from '../common';
import {
  getAddressFromLatAndLong,
  getLocationAndLongitudeFromString
} from '../../utils';

class LocationMap extends React.Component {
  state = {
    defaultAddress: 'Córdoba, Argentina',
    completeAddress: '',
    locationAsked: false
  };

  componentDidMount() {
    if (this.props.marker) {
      const {
        address,
        city,
        provinceName,
        country,
        longitude,
        latitude
      } = this.props.marker;
      this.setState({
        completeAddress: `${address}, ${city}, ${provinceName}, ${country}`
      });

      if (!longitude || !latitude) {
        this.onStringSearch(this.setAddressString());
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.latitude !== this.props.latitude &&
      prevProps.longitude !== this.props.longitude &&
      this.state.locationAsked
    ) {
      const { address, provinceName, city, country } = this.props;
      this.setState({
        locationAsked: false,
        completeAddress: `${address}, ${city}, ${provinceName}, ${country}`
      });
    }
  }

  setAddressString = () => {
    const { address, city, provinceName } = this.props.marker;

    /* 
    Se le agrega 'Calle' antes para que el mapa lo busque mejor. Sirve por mas que ya se le haya puesto 'Calle' 
    en la prop, y por mas que la calle sea una Avenida, Boulevard, pje ..porque después el mapa busca la dirección,
    y lo cambia con el nombre correcto
    */
    let newAddress = `${address !== '' ? `Calle ${address}, ` : ''}`;

    newAddress += `${city !== '' ? city + ', ' : ''}`;

    newAddress += `${provinceName !== '' ? provinceName + ', ' : ''}`;

    newAddress += 'Argentina';

    if (newAddress === 'Argentina') {
      newAddress = this.state.defaultAddress;
    }

    this.setState({ completeAddress: newAddress });
    return newAddress;
  };

  onStringSearch = async string => {
    const [latLongResult] = await getLocationAndLongitudeFromString(
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
      completeAddress: `${address}, ${city}, ${region}, ${country}`
    });

    this.props.onLocationChange({ location });
    this.props.onProvinceNameChange && this.props.onProvinceNameChange(region);
  };

  renderUserMarker = () => {
    if (this.props.marker) {
      const { latitude, longitude, address } = this.props;

      return (
        <MapView.Marker
          coordinate={{
            latitude: latitude ? latitude : -31.417378,
            longitude: longitude ? longitude : -64.18384
          }}
          title={address}
          draggable={this.props.draggable || true}
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

  renderCommerceMarkers = () => {
    // TODO: give it a different style to differentiate it with user's marker
    if (this.props.markers) {
      return this.props.markers.map((marker, index) => (
        <MapView.Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          title={marker.address}
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
    const { latitude, longitude } = this.props;

    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          {...this.props}
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
          onLongPress={e =>
            this.updateAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        >
          {this.renderUserMarker()}
          {this.renderCommerceMarkers()}
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
    markers
  } = state.locationData;

  return { address, city, provinceName, country, latitude, longitude, markers };
};

export default connect(
  mapStateToProps,
  { onLocationChange, onLocationValueChange }
)(LocationMap);
