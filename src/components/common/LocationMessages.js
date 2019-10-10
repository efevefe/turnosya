import React, { Component } from 'react';
import { Platform, View, AppState } from 'react-native';
import {
  openGPSAndroid,
  openSettingIos,
  askPermissionLocation,
  getCurrentPosition,
  getPermissionLocationStatus,
  getAddressFromLatAndLong
} from '../../utils';
import { Divider } from 'react-native-elements';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { connect } from 'react-redux';
import { onLocationChange } from '../../actions';

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
      prevState.appState !== this.state.appState &&
      this.state.appState === 'active'
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
      ? 'TurnosYa requiere permisos de localización'
      : 'Activa GPS para recibir una mejor búsqueda cerca de ti';
  };

  getAndSaveLocation = async () => {
    const currentLatLong = await getCurrentPosition();
    const { latitude, longitude } = currentLatLong.coords;
    const [addresResult] = await getAddressFromLatAndLong({
      latitude,
      longitude
    });
    const { street, city, country } = addresResult;

    const location = {
      street,
      streetNumber: addresResult.name.replace(street, ''),
      city,
      country,
      latitude,
      longitude
    };

    this.props.onLocationChange({ location });
  };

  renderItems = () => {
    const plat = Platform.OS;
    if (plat === 'ios') {
      switch (this.state.permissionStatus) {
        case 'permissionsDenied':
          return (
            <View style={styles.modalItemsContainer}>
              <MenuItem
                title="Más tarde"
                // icon=""
                onPress={() => this.closeModal()}
              />
              <MenuItem
                title="Ir a Configuraciones"
                // icon=""
                onPress={() => {
                  openSettingIos();
                  this.closeModal();
                }}
              />
            </View>
          );
        case 'permissionsAllowedWithGPSOff':
          return (
            <View>
              <Divider />
              <MenuItem
                title="1. Abre la aplicación Ajustes"
                disabled
                disabledTitleStyle={{ color: 'black' }}
              />
              <MenuItem
                title="2. Selecciona Privacidad"
                disabled
                disabledTitleStyle={{ color: 'black' }}
              />
              <MenuItem
                title="3. Selecciona Localización"
                disabled
                disabledTitleStyle={{ color: 'black' }}
              />
              <MenuItem
                title="4. Activa Localización"
                disabled
                disabledTitleStyle={{ color: 'black' }}
              />
              <MenuItem
                title="Aceptar"
                onPress={() => this.closeModal()}
                titleStyle={{ textAlign: 'right', fontSize: 15 }}
                buttonStyle={{ justifyContent: 'flex-end', paddingRight: 0 }}
                color={'#0339B1'}
              />
            </View>
          );
      }
    } else {
      return (
        <View style={styles.modalItemsContainer}>
          <MenuItem
            title="Ir a Configuraciones"
            // icon=""
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
            // icon=""
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

styles = {
  modalItemsContainer: {
    flexDirection: 'row'
  }
};

export default connect(
  null,
  { onLocationChange }
)(LocationMessages);
