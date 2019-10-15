import React from 'react';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { View, StyleSheet, Platform } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';
import { HeaderBackButton } from 'react-navigation-stack';
import LocationMessages from './common/LocationMessages';
import { Toast, IconButton } from './common';
import { onLocationChange, onLocationValueChange } from '../actions';

class LocationMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultAddress: 'Córdoba, Argentina',
      completeAddress: '',
      locationAsked: false,
      stateBeforeChanges: null
    };

    // Toda esta lógica hay que sacarla del constructor y meterla al componentDidMount. Leer documentación de React

    const { markers } = props.navigation.state.params;
    // CAMBIAR A GETPARAMS
    if (markers) {
      if (markers.length > 1) {
        props.onLocationValueChange({ prop: 'markers', value: markers });
      } else {
        for (prop in markers[0]) {
          props.onLocationValueChange({ prop, value: markers[0][prop] });
        }
      }
    }

    props.navigation.setParams({
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderBackButton()
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  async componentDidMount() {
    const { markers } = this.props.navigation.state.params;

    if (!markers) {
      const { address, city, provinceName } = this.props;
      this.setState({
        stateBeforeChanges: { address, city, provinceName }
      });
    } else if (markers.length === 1) {
      const { address, provinceName, city, longitude, latitude } = markers[0];

      this.setState({
        stateBeforeChanges: { address, provinceName, city, latitude, longitude }
      });
    }

    await this.setAddressString();
    this.getLocationAndLongitudeFromString();
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

  renderSaveButton = () => {
    return (
      <IconButton
        icon="md-checkmark"
        onPress={() => this.props.navigation.goBack()}
      />
    );
  };

  renderBackButton = () => {
    return (
      <HeaderBackButton onPress={() => this.onBackPress()} tintColor="white" />
    );
  };

  setAddressString = () => {
    //solo se ejecuta cuando se registra un nuevo comercio y no se agregan datos previos de domicilio
    const { address, city, provinceName } = this.props;

    /* 
    Se le agrega 'Calle' antes para que el mapa lo busque mejor. Sirve por mas que ya se le haya puesto 'Calle' 
    en la prop, y por mas que la calle sea una Avenida, Boulevard, pje ..porque después el mapa busca la dirección,
    y lo cambia con el nombre correcto
    */
    let newAddress = `${address !== '' ? `Calle ${address}, ` : ''}`;

    newAddress += `${city !== '' ? city + ', ' : ''}`;

    newAddress += `${provinceName !== '' ? provinceName + ', ' : ''}`;

    newAddress += 'Argentina'; //Por ahora será solo buscado en Argentina ....

    if (newAddress === 'Argentina') {
      newAddress = this.state.defaultAddress;
    }

    this.setState({ completeAddress: newAddress });
  };

  getLocationAndLongitudeFromString = async string => {
    const [latLongResult] = await Location.geocodeAsync(
      string ? string : this.state.completeAddress
    );

    if (latLongResult !== undefined) {
      const { latitude, longitude } = latLongResult;
      this.getAddressFromLatAndLong({ latitude, longitude });
    } else {
      Toast.show({
        text: 'No se han encontrado resultado. Intente modificar dirección.'
      });
    }
  };

  getAddressFromLatAndLong = async ({ latitude, longitude }) => {
    const [addresResult] = await Location.reverseGeocodeAsync({
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
      completeAddress: `${address}, ${region}, ${city}, ${country}`
    });

    this.props.onLocationChange({ location });
    if (this.props.navigation.state.params.callback) {
      this.props.navigation.state.params.callback(region);
    }
  };

  renderMarkers = () => {
    if (this.props.markers !== []) {
      const { latitude, longitude, address } = this.props;

      return (
        <MapView.Marker
          coordinate={{
            latitude: latitude ? latitude : -31.417378,
            longitude: longitude ? longitude : -64.18384
          }}
          title={address}
          draggable
          onDragEnd={e =>
            this.getAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        />
      );
    } else {
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

  renderLocationMessage = () => {
    if (this.state.locationAsked) return <LocationMessages />;
  };

  onBackPress = () => {
    this.props.onLocationChange({ location: this.state.stateBeforeChanges });

    if (this.props.navigation.state.params.callback) {
      this.props.navigation.state.params.callback(
        this.state.stateBeforeChanges.provinceName
      );
    }

    this.props.navigation.goBack();
  };

  render() {
    const { latitude, longitude } = this.props;
    const validAddress =
      this.state.completeAddress !== 'Córdoba, Argentina'
        ? this.state.completeAddress
        : '';

    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <View style={styles.mainContainer}>
          <SearchBar
            {...this.props}
            platform="android"
            placeholder="San Martín 30, Córdoba, Argentina"
            onChangeText={text => this.setState({ completeAddress: text })}
            onCancel={() => this.setState({ completeAddress: '' })}
            value={validAddress}
            containerStyle={styles.searchBarContainer}
            inputStyle={{ marginTop: 1, fontSize: 16 }}
            searchIcon={{ color: MAIN_COLOR }}
            cancelIcon={{ color: MAIN_COLOR }}
            clearIcon={{ color: MAIN_COLOR }}
            onEndEditing={e =>
              this.getLocationAndLongitudeFromString(e.nativeEvent.text)
            }
          />
        </View>
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
          onLongPress={e =>
            this.getAddressFromLatAndLong({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        >
          {this.renderMarkers()}
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

const styles = StyleSheet.create({
  mainContainer: {
    height: NAVIGATION_HEIGHT,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: MAIN_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  searchBarContainer: {
    alignSelf: 'stretch',
    height: NAVIGATION_HEIGHT,
    paddingTop: 4,
    paddingRight: 5,
    paddingLeft: 5
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
