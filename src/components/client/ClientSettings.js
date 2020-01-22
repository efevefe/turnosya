import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation-stack';
import firebase from 'firebase';
import {
  MenuItem,
  Menu,
  Input,
  CardSection,
  SettingsItem,
  Toast
} from '../common';
import { isEmailVerified } from '../../utils';
import {
  onUserDelete,
  onCommerceDelete,
  onLoginValueChange,
  onCommerceValueChange,
  onClientDataValueChange,
  sendEmailVefification
} from '../../actions';

class ClientSettings extends Component {
  state = { providerId: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          tintColor="white"
          title="Back"
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
    if (this.state.providerId === 'password') {
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
              onChangeText={password =>
                this.props.onLoginValueChange({ password })
              }
              errorMessage={this.props.reauthError}
              onFocus={() => this.props.onLoginValueChange({ error: '' })}
            />
          </CardSection>
          <Divider style={{ backgroundColor: 'grey' }} />
        </View>
      );
    }
  };

  onUserDeletePress = () => {
    if (this.props.commerceId) {
      Toast.show({
        text: 'No podés eliminar tu cuenta porque tenés un negocio'
      });
    } else {
      this.props.onClientDataValueChange({ confirmDeleteVisible: true });
    }
  };

  renderConfirmUserDelete = () => {
    // ventana de confirmación para eliminar cuenta
    return (
      <Menu
        title="¿Está seguro que desea eliminar la cuenta?"
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
    if (this.state.providerId !== 'password') {
      this.onBackdropPress();
    }

    this.props.onUserDelete(this.props.password);
  };

  onCommerceDeletePress = () => {
    if (this.props.commerceId) {
      this.props.onCommerceValueChange({ confirmDeleteVisible: true });
    } else {
      Toast.show({ text: 'No tienes ningún negocio' });
    }
  };

  renderConfirmCommerceDelete = () => {
    // ventana de confirmacion para eliminar negocio
    return (
      <Menu
        title="¿Está seguro que desea eliminar su negocio?"
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
    if (this.state.providerId !== 'password') {
      this.onBackdropPress();
    }

    this.props.onCommerceDelete(this.props.password);
  };

  onBackdropPress = () => {
    // auth
    this.props.onLoginValueChange({ password: '', error: '' });
    // client
    this.props.onClientDataValueChange({ confirmDeleteVisible: false });
    // commerce
    this.props.onCommerceValueChange({ confirmDeleteVisible: false });
  };

  onEmailVerifyPress = async () => {
    const emailVerified = await isEmailVerified();

    if (emailVerified) {
      Toast.show({ text: 'Su cuenta ya está verificada' });
    } else {
      this.props.sendEmailVefification();
    }
  };

  render() {
    return (
      <ScrollView style={styles.containerStyle}>
        {// opción de cambiar contraseña es solo para los que se autenticaron con email y password
        this.state.providerId === 'password' && (
          <SettingsItem
            leftIcon={{
              name: 'md-key',
              type: 'ionicon',
              color: 'black'
            }}
            title="Cambiar Contraseña"
            onPress={() => this.props.navigation.navigate('changeUserPassword')}
            bottomDivider
          />
        )}
        {// opción de validar mail es solo para los que se autenticaron con email y password
        this.state.providerId === 'password' && (
          <SettingsItem
            title="Verificar mi Cuenta"
            leftIcon={{
              name: 'md-mail-open',
              type: 'ionicon',
              color: 'black'
            }}
            onPress={this.onEmailVerifyPress}
            bottomDivider
          />
        )}
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

export default connect(mapStateToProps, {
  onUserDelete,
  onCommerceDelete,
  onLoginValueChange,
  onCommerceValueChange,
  onClientDataValueChange,
  sendEmailVefification
})(ClientSettings);
