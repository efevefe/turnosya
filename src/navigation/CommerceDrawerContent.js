import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { Drawer, DrawerItem } from '../components/common';
import { onCommerceRead, onScheduleValueChange } from '../actions';

class CommerceDrawerContent extends Component {
  componentDidMount() {
    this.props.onCommerceRead();
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
          icon={{ name: "md-person" }}
          onPress={() => {
            this.props.onScheduleValueChange({
              prop: 'slots',
              value: []
            });

            this.props.navigation.navigate('client');
          }}
        />
        <DrawerItem
          title="Configuración"
          icon={{ name: "md-settings" }}
          onPress={() => this.props.navigation.navigate('commerceSettings')}
        />
        <DrawerItem
          title="Cerrar Sesión"
          icon={{ name: "md-exit" }}
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
  { onLogout, onCommerceRead, onScheduleValueChange }
)(CommerceDrawerContent);
