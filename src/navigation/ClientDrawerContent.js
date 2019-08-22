import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { onCommerceOpen, onLogout } from '../actions';
import { DrawerItem } from '../components/common';
import VerifyEmailModal from '../components/VerifyEmailModal';

class ClientDrawerContent extends Component {
  state = { modal: false };

  onMyCommercePress = async () => {
    const { currentUser } = firebase.auth();
    await currentUser.reload();

    currentUser.emailVerified
      ? this.props.onCommerceOpen(this.props.navigation)
      : this.setState({ modal: true });
  };

  onModalClose = () => {
    this.setState({ modal: false });
  };

  renderModal = () => {
    if (this.state.modal)
      return <VerifyEmailModal onModalCloseCallBack={this.onModalClose} />;
  };

  render() {
    return (
      <View>
        <ScrollView>
          <SafeAreaView
            style={{ flex: 1 }}
            forceInset={{ top: 'always', horizontal: 'never' }}
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
          </SafeAreaView>
        </ScrollView>
        {this.renderModal()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { loading: state.auth.loading };
};

export default connect(
  mapStateToProps,
  { onCommerceOpen, onLogout }
)(ClientDrawerContent);
