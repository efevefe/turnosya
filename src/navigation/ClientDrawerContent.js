import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, DrawerItem } from '../components/common';
import { onCommerceOpen, onLogout, onUserRead } from '../actions';

class ClientDrawerContent extends Component {
  componentWillMount() {
    this.props.onUserRead();
  }

  returnFullName = () => {
    const { firstName, lastName } = this.props;

    if (firstName || lastName) {
      return `${firstName} ${lastName}`;
    }
  };

  render() {
    return (
      <Drawer
        profilePicture={this.props.profilePicture}
        profilePicturePlaceholder='person'
        onProfilePicturePress={() => this.props.navigation.navigate('profile')}
        name={this.returnFullName()}
      >
        <DrawerItem
          title="Mi Negocio"
          icon='ios-briefcase'
          onPress={() => this.props.onCommerceOpen(this.props.navigation)}
        />
        <DrawerItem
          title="Configuración"
          icon='md-settings'
          onPress={() => this.props.navigation.navigate('clientSettings')}
        />
        <DrawerItem
          title="Cerrar Sesión"
          icon='md-exit'
          loadingWithText={this.props.loading}
          onPress={() => this.props.onLogout()}
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const { profilePicture, firstName, lastName } = state.clientData;
  const { loading } = state.auth;

  return { profilePicture, firstName, lastName, loading };
};

export default connect(
  mapStateToProps,
  { onCommerceOpen, onLogout, onUserRead }
)(ClientDrawerContent);
