import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  onCommerceOpen,
  onLogout,
  onUserRead,
  onUserWorkplacesRead,
  onCommerceRead
} from '../actions';
import { Drawer, DrawerItem } from '../components/common';
import { isEmailVerified } from '../utils';
import VerifyEmailModal from '../components/client/VerifyEmailModal';
import { AREAS } from '../constants';

class ClientDrawerContent extends Component {
  state = { modal: false, loadingId: '' };

  componentDidMount() {
    this.props.onUserRead();
    this.props.onUserWorkplacesRead();
  }

  onCommercePress = commerceId => {
    this.setState({ loadingId: commerceId },
      async () => {
        try {
          if (await isEmailVerified()) {
            this.props.onCommerceOpen(commerceId);

            const success = await this.props.onCommerceRead(commerceId);

            if (success && this.props.areaId) {
              this.props.navigation.navigate(`${this.props.areaId}`);
              this.props.navigation.navigate(`${this.props.areaId}Calendar`);
            }
          } else {
            this.setState({ modal: true });
          }
        } catch (error) {
          console.error(error);
        }
      })
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

  renderWorkplaces = () => {
    return this.props.workplaces.map(workplace => (
      <DrawerItem
        key={workplace.commerceId}
        title={workplace.name}
        icon={{ name: 'store', type: 'material' }}
        loadingWithText={this.props.loadingCommerce && this.state.loadingId === workplace.commerceId}
        onPress={() => this.onCommercePress(workplace.commerceId)}
      />
    ));
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
            icon={{ name: 'ios-briefcase' }}
            loadingWithText={this.props.loadingCommerce && this.state.loadingId === this.props.commerceId}
            onPress={() => {
              this.props.commerceId
                ? this.onCommercePress(this.props.commerceId)
                : this.props.navigation.navigate('commerceRegister')
            }}
          />
          {this.renderWorkplaces()}
          <DrawerItem
            title="Configuración"
            icon={{ name: 'md-settings' }}
            onPress={() => this.props.navigation.navigate('clientSettings')}
          />
          <DrawerItem
            title="Cerrar Sesión"
            icon={{ name: 'md-exit' }}
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
  const {
    profilePicture,
    firstName,
    lastName,
    workplaces,
    commerceId
  } = state.clientData;
  const { area: { areaId }, refreshing: loadingCommerce } = state.commerceData;
  const { loading } = state.auth;

  return {
    profilePicture,
    firstName,
    lastName,
    loading,
    workplaces,
    commerceId,
    areaId,
    loadingCommerce
  };
};

export default connect(mapStateToProps, {
  onCommerceOpen,
  onLogout,
  onUserRead,
  onUserWorkplacesRead,
  onCommerceRead
})(ClientDrawerContent);
