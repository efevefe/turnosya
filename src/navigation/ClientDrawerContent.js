import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { onCommerceOpen, onLogout, onUserRead } from '../actions';
import { Drawer, DrawerItem } from '../components/common';
import { isEmailVerified } from '../utils';
import VerifyEmailModal from '../components/common/VerifyEmailModal';

class ClientDrawerContent extends Component {
  state = { modal: false };

  componentDidMount() {
    this.props.onUserRead();
  }

  onMyCommercePress = async () => {
    (await isEmailVerified())
      ? this.props.onCommerceOpen(this.props.navigation)
      : this.setState({ modal: true });
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
            onPress={() => this.props.onLogout()}
          />
        </Drawer>
        {this.renderModal()}
      </View>
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
