import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  onMyCommerceOpen,
  onCommerceOpen,
  onLogout,
  onUserRead,
  onScheduleValueChange,
  readUserWorkplaces,
  onCommerceRead
} from '../actions';
import { Drawer, DrawerItem } from '../components/common';
import { isEmailVerified } from '../utils';
import VerifyEmailModal from '../components/client/VerifyEmailModal';

class ClientDrawerContent extends Component {
  state = { modal: false };

  componentDidMount() {
    this.props.onUserRead();
    this.props.readUserWorkplaces();
  }

  onCommercePress = async commerceId => {
    try {
      if (await isEmailVerified()) {
        this.props.onCommerceOpen(commerceId);

        const success = await this.props.onCommerceRead(commerceId);

        if (success && this.props.areaId) {
          this.props.navigation.navigate(`${this.props.areaId}Navigation`);
        }
      } else {
        this.setState({ modal: true });
      }
    } catch (error) {
      console.error(error);
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

  renderWorkplaces = () => {
    return this.props.workplaces.map(workplace => (
      <DrawerItem
        key={workplace.commerceId}
        title={workplace.name}
        icon={{ name: 'store', type: 'material' }}
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
            loadingWithText={this.props.loadingCommerce}
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
            onPress={() => this.props.onLogout()}
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
  onMyCommerceOpen,
  onCommerceOpen,
  onLogout,
  onUserRead,
  onScheduleValueChange,
  readUserWorkplaces,
  onCommerceRead
})(ClientDrawerContent);
