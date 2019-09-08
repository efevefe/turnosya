import React, { Component } from 'react';
import { Platform, View, Text } from 'react-native';
import {
  openGPSAndroid,
  openSettingIos,
  askPermissionLocation
} from '../../utils';
import { Divider } from 'react-native-elements';
import { Menu, MenuItem, Button } from '../common';

class LocationMessages extends Component {
  state = {
    location: null,
    modal: true,
    title: null
  };

  renderTitle = () => {
    switch (this.props.permissionStatus) {
      case '1':
        return this.setState({ modal: false, title: 'algo' });
      case '2':
        return this.setState({ title: 'Aceptate los permisos perri.' });
      case '3':
        return this.setState({
          title: 'Prenda el GPS para una mejor búsqueda?'
        });
    }
  };

  renderItems = () => {
    const plat = Platform.OS;
    if (plat === 'ios') {
      switch (this.props.permissionStatus) {
        case '2':
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
        case '3':
          return (
            <View>
              <MenuItem
                title="Ir a Configuraciones"
                // icon=""
                onPress={() => {
                  //hay que ver como abrimos el GPS o poner los distintos menuItem
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
    } else {
      switch (this.props.permissionStatus) {
        case '2':
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
        case '3':
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

export { LocationMessages };
