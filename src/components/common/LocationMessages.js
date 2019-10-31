import React, { Component } from 'react';
import {
  Platform,
  View,
  AppState,
  StyleSheet,
  Image,
  Text
} from 'react-native';
import { Divider } from 'react-native-elements';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { connect } from 'react-redux';
import { onLocationChange } from '../../actions';
import {
  openGPSAndroid,
  openSettingIos,
  askPermissionLocation,
  getCurrentPosition,
  getPermissionLocationStatus,
  getAddressFromLatAndLong
} from '../../utils';

class LocationMessages extends Component {
  state = {
    location: 'location sin setear',
    appState: AppState.currentState,
    permissionStatus: null,
    modal: false
  };

  async componentDidMount() {
    const permissionStatus = await getPermissionLocationStatus();
    permissionStatus === 'permissionsAllowed'
      ? this.setState({ permissionStatus })
      : this.setState({ permissionStatus, modal: true });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.state.appState === 'active' &&
      prevState.appState !== this.state.appState
    ) {
      this.setState({
        permissionStatus: await getPermissionLocationStatus(),
        modal: true
      });
    }
  }

  _handleAppStateChange = appState => {
    this.setState({ appState });
  };

  renderTitle = () => {
    return this.state.permissionStatus === 'permissionsDenied'
      ? 'TurnosYa necesita permisos para acceder a tu ubicación'
      : 'Activa el GPS para recibir una mejor búsqueda cerca de ti';
  };

  getAndSaveLocation = async () => {
    const currentLatLong = await getCurrentPosition();
    const { latitude, longitude } = currentLatLong.coords;
    const [addresResult] = await getAddressFromLatAndLong({
      latitude,
      longitude
    });
    const { name, street, city, region, country } = addresResult;

    const address = Platform.OS === 'ios' ? name : `${street} ${name}`;

    const location = {
      address,
      city,
      provinceName: region,
      country,
      latitude,
      longitude
    };

    this.props.onLocationChange({ location });
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
              <MenuItem
                title="Más tarde"
                icon="md-time"
                onPress={() => this.closeModal()}
              />
            </View>
          );
        case 'permissionsAllowedWithGPSOff':
          return (
            <View>
              <View style={styles.iosModalItem}>
                <Image
                  source={require('../../../assets/ios-icons/settings.png')}
                  style={styles.iosModalIcon}
                />
                <Text style={styles.iosModalText}>
                  Abrí la aplicación Ajustes
                </Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image
                  source={require('../../../assets/ios-icons/privacy.png')}
                  style={styles.iosModalIcon}
                />
                <Text style={styles.iosModalText}>Seleccioná Privacidad</Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image
                  source={require('../../../assets/ios-icons/location.png')}
                  style={styles.iosModalIcon}
                />
                <Text style={styles.iosModalText}>Seleccioná Localización</Text>
              </View>
              <Divider />
              <View style={styles.iosModalItem}>
                <Image
                  source={require('../../../assets/ios-icons/switch.png')}
                  style={styles.iosModalIcon}
                />
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
              this.state.permissionStatus === 'permissionsDenied'
                ? askPermissionLocation()
                : openGPSAndroid();
              this.closeModal();
            }}
          />
          <Divider />
          <MenuItem
            title="Más tarde"
            icon="md-time"
            onPress={() => this.closeModal()}
          />
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

export default connect(
  null,
  { onLocationChange }
)(LocationMessages);
