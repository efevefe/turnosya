import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { Drawer, DrawerItem } from '../components/common';
import { onCommerceRead, onScheduleValueChange } from '../actions';
import PermissionsAssigner from '../components/common/PermissionsAssigner';
import { ROLES } from '../constants';

class CommerceDrawerContent extends Component {
  componentDidMount() {
    this.props.onCommerceRead(this.props.commerceId);
  }

  render() {
    return (
      <Drawer
        profilePicture={this.props.profilePicture}
        profilePicturePlaceholder="store"
        onProfilePicturePress={() => this.props.navigation.navigate('profile')}
        name={this.props.name}
      >
        <DrawerItem
          title="Ser Cliente"
          icon={{ name: 'md-person' }}
          onPress={() => {
            this.props.onScheduleValueChange({ slots: [] });
            this.props.navigation.navigate('client');
          }}
        />
        <DrawerItem
          title="Empleados"
          icon={{ name: 'md-people' }}
          onPress={() => this.props.navigation.navigate('commerceEmployees')}
        />
        <DrawerItem
          title="Notificaciones"
          icon={{ name: 'md-notifications-outline' }}
          onPress={() => this.props.navigation.navigate('commerceNotifications')}
        />
        <PermissionsAssigner requiredRole={ROLES.OWNER}>
          <DrawerItem
            title="Configuración"
            icon={{ name: 'md-settings' }}
            onPress={() => this.props.navigation.navigate('commerceSettings')}
          />
        </PermissionsAssigner>
        <DrawerItem
          title="Cerrar Sesión"
          icon={{ name: 'md-exit' }}
          loadingWithText={this.props.loading}
          onPress={() => this.props.onLogout(this.props.commerceId)}
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const { name, profilePicture, commerceId } = state.commerceData;
  const { loading } = state.auth;

  return { name, profilePicture, commerceId, loading };
};

export default connect(mapStateToProps, {
  onLogout,
  onCommerceRead,
  onCommerceRead,
  onScheduleValueChange
})(CommerceDrawerContent);
