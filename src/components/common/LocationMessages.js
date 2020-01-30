import React, { Component } from 'react';
import { Platform, View, AppState, StyleSheet, Image, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { connect } from 'react-redux';
import { onLocationValueChange } from '../../actions';
import {
  openGPSAndroid,
  openSettingIos,
  askPermissionLocation,
  getCurrentPosition,
  getPermissionLocationStatus,
  getAddressFromLatAndLong
} from '../../utils';

class LocationMessages extends Component {
  state = { appState: AppState.currentState, permissionStatus: null, modal: false };

  async componentDidMount() {
    try {
      const permissionStatus = await getPermissionLocationStatus();
      if (permissionStatus === 'permissionsAllowed') {
        this.setState({ permissionStatus });
      } else {
        this.setState({ permissionStatus, modal: true });
      }
      AppState.addEventListener('change', this._handleAppStateChange);
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async appState => {
    try {
      if (appState === 'active' && this.state.appState !== appState) {
        this.props.onLocationFound && this.props.onLocationFound({ updating: true, location: null });
        this.setState({ permissionStatus: await getPermissionLocationStatus(), modal: true, appState });
      } else {
        this.setState({ appState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderTitle = () => {
    return this.state.permissionStatus === 'permissionsDenied'
      ? 'TurnosYa necesita permisos para acceder a tu ubicación'
      : 'Activa el GPS para recibir una mejor búsqueda cerca de ti';
  };

  getAndSaveLocation = async () => {
    try {
      const currentLatLong = await getCurrentPosition();
      const { latitude, longitude } = currentLatLong.coords;

      if (latitude && this.props.latitude !== latitude && longitude && this.props.longitude !== longitude) {
        const [addressResult] = await getAddressFromLatAndLong({ latitude, longitude });
        const { name, street, city, region, country } = addressResult;

        const address = Platform.OS === 'ios' ? name : `${street} ${name}`;

        const location = {
          address,
          city,
          provinceName: region,
          country,
          latitude,
          longitude
        };

        this.props.onLocationFound && this.props.onLocationFound({ updating: false, location });
      } else if (!latitude || !longitude) {
        this.updateUserLocation();
      }
    } catch (error) {
      console.error(error);
    }
  };

  updateUserLocation = () => {
    if (this.props.latitude && this.props.longitude) {
      // Esto se hace para que cuando el marker de 'UserLocation' se está mostrando en el mapa,
      // y  después de apaga el GPS o deje de dar permisos, este marker desaparezca.
      // PD: El borrado del mapa no es instantáneo porque no queda el compoente escuchando, pero la
      // próxima vez que se presione el Fab y te aparezca el cartel solicitando GPS, se borra el marker
      this.props.onLocationValueChange({ userLocation: { latitude: null, longitude: null } });
    }

    const updating = this.state.permissionStatus ? false : true;
    this.props.onLocationFound && this.props.onLocationFound({ updating, location: null });
  };

  renderItems = () => {
    if (Platform.OS === 'ios') {
      switch (this.state.permissionStatus) {
        case 'permissionsDenied':
          return (
            <View>
              <MenuItem
                title="Ir a Configuración"
                icon="md-settings"
                onPress={() => {
                  openSettingIos();
                  this.closeModal();
                }}
              />
              <Divider />
              <MenuItem title="Más tarde" icon="md-time" onPress={() => this.closeModal()} />
            </View>
          );
        case 'permissionsAllowedWithGPSOff':
          return (
            <View>
              <View style={styles.iosModalItem}>
                <Image source={require('../../../assets/ios-icons/settings.png')} style={styles.iosModalIcon} />
                <Text style={styles.iosModalText}>Abrí la aplicación Ajustes</Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image source={require('../../../assets/ios-icons/privacy.png')} style={styles.iosModalIcon} />
                <Text style={styles.iosModalText}>Seleccioná Privacidad</Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image source={require('../../../assets/ios-icons/location.png')} style={styles.iosModalIcon} />
                <Text style={styles.iosModalText}>Seleccioná Localización</Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image source={require('../../../assets/ios-icons/switch.png')} style={styles.iosModalIcon} />
                <Text style={styles.iosModalText}>Activá la Localización</Text>
              </View>
              <Divider />
              <MenuItem
                title="Cerrar"
                icon="md-close"
                onPress={() => this.closeModal()}
                buttonStyle={{ justifyContent: 'flex-end', paddingRight: 5 }}
                titleStyle={{ marginLeft: 5 }}
              />
            </View>
          );
      }
    } else {
      return (
        <View>
          <MenuItem
            title="Ir a Configuración"
            icon="md-settings"
            onPress={() => {
              this.state.permissionStatus === 'permissionsDenied' ? askPermissionLocation() : openGPSAndroid();
              this.closeModal();
            }}
          />
          <Divider />
          <MenuItem title="Más tarde" icon="md-time" onPress={() => this.closeModal()} />
        </View>
      );
    }
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    if (this.state.permissionStatus === 'permissionsAllowed') {
      this.getAndSaveLocation();
      return <View />;
    } else {
      this.updateUserLocation();
      return (
        <View>
          <Menu
            title={this.renderTitle()}
            titleContainerStyle={{ alignSelf: 'center' }}
            titleStyle={{ textAlign: 'center' }}
            isVisible={this.state.modal}
          >
            {this.renderItems()}
          </Menu>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  iosModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 8,
    paddingLeft: 15
  },
  iosModalText: {
    fontWeight: '400',
    fontSize: 13,
    marginLeft: 15
  },
  iosModalIcon: {
    height: 30,
    width: 30
  }
});

const mapStateToProps = state => {
  const { latitude, longitude } = state.locationData.userLocation;

  return { latitude, longitude };
};

export default connect(mapStateToProps, { onLocationValueChange })(LocationMessages);
