import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { Drawer, DrawerItem } from '../components/common';
import { onCommerceRead, onScheduleValueChange } from '../actions';
import PermissionsAssigner from '../components/common/PermissionsAssigner';
import { ROLES } from '../constants';

class CommerceDrawerContent extends Component {
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
          onPress={() => this.props.onLogout()}
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const { name, profilePicture, commerceId } = state.commerceData;
  const { loading } = state.auth;
  const {
    role: { roleId },
  } = state.roleData;

  return { name, profilePicture, commerceId, loading, roleId };
};

export default connect(mapStateToProps, {
  onLogout,
  onCommerceRead,
  onCommerceRead,
  onScheduleValueChange,
})(CommerceDrawerContent);
