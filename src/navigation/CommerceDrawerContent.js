import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { Drawer, DrawerItem, PermissionsAssigner } from '../components/common';
import { onCommerceRead, onScheduleValueChange, onCommerceMPagoTokenRead } from '../actions';
import { ROLES } from '../constants';

class CommerceDrawerContent extends Component {
  componentDidMount() {
    this.props.onCommerceMPagoTokenRead(this.props.commerceId);
  }

  render() {
    return (
      <Drawer
        profilePicture={this.props.profilePicture}
        profilePicturePlaceholder="store"
        onProfilePicturePress={() => this.props.navigation.navigate('profile')}
        name={this.props.name}
        role={ROLES[this.props.roleId].name}
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
          loadingWithText={this.props.loadingNotifications}
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
          loadingWithText={this.props.loadingLogout}
          onPress={() => this.props.onLogout(this.props.commerceId, this.props.workplaces)}
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const { name, profilePicture, commerceId } = state.commerceData;
  const { loading: loadingLogout } = state.auth;
  const { role: { roleId } } = state.roleData;
  const { workplaces } = state.clientData;
  const { loading: loadingNotifications } = state.notificationsList;

  return { name, profilePicture, commerceId, loadingLogout, roleId, workplaces, loadingNotifications };
};

export default connect(mapStateToProps, {
  onLogout,
  onCommerceRead,
  onScheduleValueChange,
  onCommerceMPagoTokenRead
})(CommerceDrawerContent);
