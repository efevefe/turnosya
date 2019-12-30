import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  onCommerceOpen,
  onLogout,
  onUserRead,
  onScheduleValueChange
} from '../actions';
import { Drawer, DrawerItem } from '../components/common';
import { isEmailVerified } from '../utils';
import VerifyEmailModal from '../components/client/VerifyEmailModal';

class ClientDrawerContent extends Component {
  state = { modal: false };

  componentDidMount() {
    this.props.onUserRead();
  }

  onMyCommercePress = async () => {
    try {
      (await isEmailVerified())
        ? this.props.onCommerceOpen(this.props.navigation)
        : this.setState({ modal: true });
    } catch (e) {
      console.error(e);
    }
  };

  onModalClose = () => {
    this.setState({ modal: false });
  };

  renderModal = () => {
    if (this.state.modal)
      return <VerifyEmailModal onModalCloseCallback={this.onModalClose} />;
  };

  returnFullName = () => {
    const { firstName, lastName } = this.props;

    if (firstName || lastName) {
      return `${firstName} ${lastName}`;
    }
  };

  render() {
    return (
      <View>
        <Drawer
          profilePicture={this.props.profilePicture}
          profilePicturePlaceholder="person"
          onProfilePicturePress={() =>
            this.props.navigation.navigate('profile')
          }
          name={this.returnFullName()}
        >
          <DrawerItem
            title="Mi Negocio"
            icon="ios-briefcase"
            onPress={() => this.onMyCommercePress()}
          />
          <DrawerItem
            title="Configuración"
            icon="md-settings"
            onPress={() => this.props.navigation.navigate('clientSettings')}
          />
          <DrawerItem
            title="Cerrar Sesión"
            icon="md-exit"
            loadingWithText={this.props.loading}
            onPress={() => this.props.onLogout(this.props.commerceId)}
          />
        </Drawer>
        {this.renderModal()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { profilePicture, firstName, lastName,commerceId } = state.clientData;
  const { loading } = state.auth;

  return { profilePicture, firstName, lastName, loading, commerceId };
};

export default connect(
  mapStateToProps,
  { onCommerceOpen, onLogout, onUserRead, onScheduleValueChange }
)(ClientDrawerContent);
