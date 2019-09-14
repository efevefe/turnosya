import React, { Component } from 'react';
import { Platform, View, AppState, Text } from 'react-native';
import {
  openGPSAndroid,
  openSettingIos,
  askPermissionLocation,
  getCurrentPosition,
  getPermissionLocationStatus
} from '../../utils';
import { Divider } from 'react-native-elements';
import { Menu, MenuItem, Button } from '../common';

class LocationMessages extends Component {
  state = {
    location: 'location sin setear',
    title: null,
    appState: AppState.currentState,
    permissionStatus: null,
    modal: false
  };

  async componentDidMount() {
    this.setState({ permissionStatus: await getPermissionLocationStatus() });
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

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
  };

  renderTitle = () => {
    switch (this.state.permissionStatus) {
      case 'permissionsAllowed':
        return this.setState({ title: 'algo' });
      case 'permissionsDenied':
        return this.setState({
          title: 'Aceptate los permisos perri.'
        });
      case 'permissionsAllowedWithGPSOff':
        return this.setState({
          title: 'Prenda el GPS para una mejor búsqueda?'
        });
    }
  };

  getLocation = async () => {
    this.setState({ location: await getCurrentPosition() });
  };

  renderItems = () => {
    const plat = Platform.OS;
    if (plat === 'ios') {
      switch (this.state.permissionStatus) {
        case 'permissionsDenied':
          return (
            <View>
              <MenuItem
                title="Ir a Configuraciones"
                // icon=""
                onPress={() => {
                  openSettingIos();
                  this.setState({ modal: false });
                }}
              />
              <Divider />
              <MenuItem
                title="Cancelar"
                // icon=""
                onPress={() => this.setState({ modal: false })}
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
                onPress={() => this.setState({ modal: false })}
                titleStyle={{ textAlign: 'right', fontSize: 15 }}
                buttonStyle={{ justifyContent: 'flex-end', paddingRight: 0 }}
                color={'#0339B1'}
              />
            </View>
          );
      }
    } else {
      switch (this.state.permissionStatus) {
        case 'permissionsDenied':
          return (
            <View>
              <MenuItem
                title="Apreta para aceptar los permisos perri"
                // icon=""
                onPress={() => {
                  askPermissionLocation();
                  this.setState({ modal: false });
                }}
              />
              <Divider />
              <MenuItem
                title="Cancelar"
                // icon=""
                onPress={() => this.setState({ modal: false })}
              />
            </View>
          );
        case 'permissionsAllowedWithGPSOff':
          return (
            <View>
              <MenuItem
                title="Ir a setings"
                // icon=""
                onPress={() => {
                  openGPSAndroid();
                  this.setState({ modal: false });
                }}
              />
              <Divider />
              <MenuItem
                title="Cancelar"
                // icon=""
                onPress={() => this.setState({ modal: false })}
              />
            </View>
          );
      }
    }
  };

  render() {
    if (this.state.permissionStatus === 'permissionsAllowed') {
      return (
        <View>
          <Button
            title="Hacer algun cambio en el state"
            onPress={() => this.getLocation()}
          />
          <Text>{JSON.stringify(this.state.location)}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Menu
            title={this.state.title || this.renderTitle()}
            onBackdropPress={() => this.setState({ modal: false })}
            isVisible={this.state.modal}
          >
            {this.renderItems()}
          </Menu>
        </View>
      );
    }
  }
}

export { LocationMessages };
