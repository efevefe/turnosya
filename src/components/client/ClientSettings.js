import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation-stack';
import firebase from 'firebase';
import { MenuItem, Menu, Input, CardSection, SettingsItem, Toast } from '../common';
import {
  onUserDelete,
  onCommerceDelete,
  onLoginValueChange,
  onCommerceValueChange,
  onClientDataValueChange
} from '../../actions';

class ClientSettings extends Component {
  state = { providerId: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          tintColor="white"
          title='Back'
          onPress={() => navigation.goBack(null)}
        />
      )
    };
  };

  componentDidMount() {
    this.setState({
      providerId: firebase.auth().currentUser.providerData[0].providerId
    });
  }

  renderPasswordInput = () => {
    // muestra el input de contraseña para confirmar eliminacion de cuenta o negocio si ese es el metodo de autenticacion
    if (this.state.providerId == 'password') {
      return (
        <View style={{ alignSelf: 'stretch' }}>
          <CardSection
            style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}
          >
            <Input
              label="Contraseña:"
              password
              value={this.props.password}
              color="black"
              onChangeText={value =>
                this.props.onLoginValueChange({ prop: 'password', value })
              }
              errorMessage={this.props.reauthError}
              onFocus={() =>
                this.props.onLoginValueChange({ prop: 'error', value: '' })
              }
            />
          </CardSection>
          <Divider style={{ backgroundColor: 'grey' }} />
        </View>
      );
    }
  };

  onUserDeletePress = () => {
    if (this.props.commerceId) {
      Toast.show({ text: 'No puedes eliminar tu cuenta porque tienes un negocio' });
    } else {
      this.props.onClientDataValueChange({
        prop: 'confirmDeleteVisible',
        value: true
      });
    }
  };

  renderConfirmUserDelete = () => {
    // ventana de confirmacion para eliminar cuenta
    return (
      <Menu
        title="¿Esta seguro que desea eliminar la cuenta?"
        onBackdropPress={this.onBackdropPress}
        isVisible={this.props.confirmUserDeleteVisible}
      >
        {this.renderPasswordInput()}
        <MenuItem
          title="Confirmar"
          icon="md-checkmark"
          loadingWithText={this.props.loadingUserDelete}
          onPress={this.onConfirmUserDelete}
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem
          title="Cancelar"
          icon="md-close"
          onPress={this.onBackdropPress}
        />
      </Menu>
    );
  };

  onConfirmUserDelete = () => {
    if (this.state.providerId != 'password') {
      this.onBackdropPress();
    }

    this.props.onUserDelete(this.props.password);
  };

  onCommerceDeletePress = () => {
    if (this.props.commerceId) {
      this.props.onCommerceValueChange({
        prop: 'confirmDeleteVisible',
        value: true
      });
    } else {
      Toast.show({ text: 'No tienes ningun negocio' });
    }
  };

  renderConfirmCommerceDelete = () => {
    // ventana de confirmacion para eliminar negocio
    return (
      <Menu
        title="¿Esta seguro que desea eliminar su negocio?"
        onBackdropPress={this.onBackdropPress}
        isVisible={this.props.confirmCommerceDeleteVisible}
      >
        {this.renderPasswordInput()}
        <MenuItem
          title="Confirmar"
          icon="md-checkmark"
          loadingWithText={this.props.loadingCommerceDelete}
          onPress={this.onConfirmCommerceDelete}
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem
          title="Cancelar"
          icon="md-close"
          onPress={this.onBackdropPress}
        />
      </Menu>
    );
  };

  onConfirmCommerceDelete = () => {
    if (this.state.providerId != 'password') {
      this.onBackdropPress();
    }

    this.props.onCommerceDelete(this.props.password);
  };

  onBackdropPress = () => {
    // auth
    this.props.onLoginValueChange({ prop: 'password', value: '' });
    this.props.onLoginValueChange({ prop: 'error', value: '' });
    // client
    this.props.onClientDataValueChange({
      prop: 'confirmDeleteVisible',
      value: false
    });
    // commerce
    this.props.onCommerceValueChange({
      prop: 'confirmDeleteVisible',
      value: false
    });
  };

  render() {
    return (
      <ScrollView style={styles.containerStyle}>
        {
          // opcion de cambiar contraseña es solo para los que se autenticaron con email y password
          this.state.providerId === 'password' &&
          <SettingsItem
            leftIcon={{
              name: 'md-key',
              type: 'ionicon',
              color: 'black'
            }}
            title='Cambiar Contraseña'
            onPress={() => this.props.navigation.navigate('changeUserPassword')}
            bottomDivider
          />
        }
        <SettingsItem
          leftIcon={{
            name: 'md-trash',
            type: 'ionicon',
            color: 'black'
          }}
          title="Eliminar Mi Negocio"
          onPress={this.onCommerceDeletePress}
          loading={this.props.loadingCommerceDelete}
          bottomDivider
        />
        <SettingsItem
          leftIcon={{
            name: 'md-trash',
            type: 'ionicon',
            color: 'black'
          }}
          title="Eliminar Cuenta"
          onPress={this.onUserDeletePress}
          loading={this.props.loadingUserDelete}
          bottomDivider
        />

        {/* Opción en configuraciones para explicar y permitir mandar mail de configuracion*/}
        {/* <SettingsItem
          title="Verificar mi Cuenta"
          leftIcon={{
            name: 'md-mail-open',
            type: 'ionicon',
            color: 'black'
          }}
          onPress={}
        /> */}

        {this.renderConfirmUserDelete()}
        {this.renderConfirmCommerceDelete()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'stretch',
    flex: 1
  }
});

const mapStateToProps = state => {
  // client
  const loadingUserDelete = state.clientData.loading;
  const confirmUserDeleteVisible = state.clientData.confirmDeleteVisible;
  const { commerceId } = state.clientData;
  // commerce
  const loadingCommerceDelete = state.commerceData.loading;
  const confirmCommerceDeleteVisible = state.commerceData.confirmDeleteVisible;
  // auth
  const { password, error } = state.auth;

  return {
    loadingUserDelete,
    loadingCommerceDelete,
    commerceId,
    password,
    reauthError: error,
    confirmUserDeleteVisible,
    confirmCommerceDeleteVisible
  };
};

export default connect(
  mapStateToProps,
  {
    onUserDelete,
    onCommerceDelete,
    onLoginValueChange,
    onCommerceValueChange,
    onClientDataValueChange
  }
)(ClientSettings);
