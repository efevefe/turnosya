import React from 'react';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { Fab } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';
import LocationMessages from './common/LocationMessages';
import { Toast, IconButton } from '../components/common';
import { onLocationChange, onLocationValueChange } from '../actions';

class GeocodingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultAddress: 'Córdoba, Argentina',
      completeAddress: '',
      locationAsked: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title')
    };
  };

  async componentDidMount() {
    await this.setAddressString(); //definir en el contructor y no hace falta usar asyn await
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

  setAddressString = () => {
    const { address, city, provinceName } = this.props;

    /* 
    Se le agrega 'Calle' antes para que el mapa lo busque mejor. Sirve por mas que ya se le haya puesto 'Calle' 
    en la prop, y por mas que la calle sea una Avenida, Boulevard ..porque después el mapa busca la dirección,
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
    const { name, city, region, country } = addresResult;

    const location = {
      latitude,
      longitude,
      address: name,
      provinceName: region,
      city,
      country
    };

    this.setState({
      completeAddress: `${name}, ${region}, ${city}, ${country}`
    });

    this.props.onLocationChange({ location });
    if (this.props.navigation.state.params.callback) {
      this.props.navigation.state.params.callback(region);
    }
  };

  renderLocationMessage = () => {
    if (this.state.locationAsked) return <LocationMessages />;
  };

  render() {
    const { latitude, longitude, address } = this.props;
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
            title={address}
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
          style={{ backgroundColor: MAIN_COLOR, top: '80%' }}
          position="topRight"
          onPress={() => this.setState({ locationAsked: true })}
        >
          <Ionicons name="md-locate" />
        </Fab>
        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomLeft"
          onPress={() => console.log('cancelar tuti')}
        >
          <Ionicons name="md-close" />
        </Fab>
        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => console.log('guardar location recien aca')}
        >
          <Ionicons name="md-checkmark" />
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
    longitude
  } = state.locationData;

  return { address, city, provinceName, country, latitude, longitude };
};

export default connect(
  mapStateToProps,
  { onLocationChange, onLocationValueChange }
)(GeocodingScreen);
