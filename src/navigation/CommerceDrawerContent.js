import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { Drawer, DrawerItem } from '../components/common';
import { onCommerceRead } from '../actions';

class CommerceDrawerContent extends Component {
  componentWillMount() {
    this.props.onCommerceRead();
  }

  render() {
    return (
      <Drawer
        profilePicture={this.props.profilePicture}
        profilePicturePlaceholder='store'
        onProfilePicturePress={() => this.props.navigation.navigate('profile')}
        name={this.props.name}
      >
        <DrawerItem
          title="Ser Cliente"
          icon='md-person'
          onPress={() => this.props.navigation.navigate('client')}
        />
        <DrawerItem
          title="Configuración"
          icon='md-settings'
          onPress={() => this.props.navigation.navigate('commerceSettings')}
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
  const { name, profilePicture } = state.commerceData;
  const { loading } = state.auth;

  return { name, profilePicture, loading };
};

export default connect(
  mapStateToProps,
  { onLogout, onCommerceRead }
)(CommerceDrawerContent);
