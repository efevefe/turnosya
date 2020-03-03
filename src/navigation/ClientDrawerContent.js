import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { onCommerceOpen, onLogout, onUserRead, onUserWorkplacesRead, onCommerceRead } from '../actions';
import { Drawer, DrawerItem } from '../components/common';
import { ROLES } from '../constants';
import { isEmailVerified } from '../utils';
import VerifyEmailModal from '../components/client/VerifyEmailModal';

class ClientDrawerContent extends Component {
  state = { modal: false, loadingId: '' };

  componentDidMount() {
    this.props.onUserRead();
    this.props.onUserWorkplacesRead();
  }

  onMyCommercePress = async () => {
    try {
      if (await isEmailVerified()) {
        this.props.commerceId
          ? this.onCommercePress(this.props.commerceId)
          : this.props.navigation.navigate('commerceRegister');
      } else {
        this.setState({ modal: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  onCommercePress = commerceId => {
    this.setState({ loadingId: commerceId }, async () => {
      try {
        this.props.onCommerceOpen(commerceId);
        const success = await this.props.onCommerceRead(commerceId);

        if (success && this.props.areaId && this.props.role.roleId) {
          this.props.navigation.navigate(
            `${this.props.areaId}${this.props.role.value === ROLES.EMPLOYEE.value ? 'Employees' : ''}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  onModalClose = () => {
    this.setState({ modal: false });
  };

  renderEmailModal = () => {
    if (this.state.modal) return <VerifyEmailModal onModalCloseCallback={this.onModalClose} />;
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
          onProfilePicturePress={() => this.props.navigation.navigate('profile')}
          name={this.returnFullName()}
        >
          <DrawerItem
            title="Mi Negocio"
            icon={{ name: 'ios-briefcase' }}
            loadingWithText={this.props.loadingCommerce && this.state.loadingId === this.props.commerceId}
            onPress={this.onMyCommercePress}
          />
          {this.renderWorkplaces()}
          <DrawerItem
            title="Notificaciones"
            icon={{ name: 'md-notifications-outline' }}
            loadingWithText={this.props.loadingNotifications}
            onPress={() => this.props.navigation.navigate('clientNotifications')}
          />
          <DrawerItem
            title="Configuración"
            icon={{ name: 'md-settings' }}
            onPress={() => this.props.navigation.navigate('clientSettings')}
          />
          <DrawerItem
            title="Cerrar Sesión"
            icon={{ name: 'md-exit' }}
            loadingWithText={this.props.loadingLogout}
            onPress={() => this.props.onLogout(this.props.commerceId, this.props.workplaces)}
          />
        </Drawer>
        {this.renderEmailModal()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { profilePicture, firstName, lastName, workplaces, commerceId } = state.clientData;
  const {
    area: { areaId },
    loading: loadingCommerce
  } = state.commerceData;
  const { loading: loadingLogout } = state.auth;
  const { loading: loadingNotifications } = state.notificationsList;
  const { role } = state.roleData;

  return {
    profilePicture,
    firstName,
    lastName,
    loadingLogout,
    workplaces,
    commerceId,
    areaId,
    role,
    loadingCommerce,
    loadingNotifications
  };
};

export default connect(mapStateToProps, {
  onCommerceOpen,
  onLogout,
  onUserRead,
  onUserWorkplacesRead,
  onCommerceRead
})(ClientDrawerContent);
