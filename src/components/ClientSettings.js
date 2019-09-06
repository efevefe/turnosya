import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'firebase';
import { MenuItem, Menu, Input, CardSection } from '../components/common';
import {
  onUserDelete,
  onCommerceDelete,
  onLoginValueChange,
  onCommerceValueChange,
  onRegisterValueChange
} from '../actions';

class ClientSettings extends Component {
  state = { cantDeleteUser: false, dontHaveCommerce: false, providerId: null };

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          tintColor="white"
          onPress={() => navigation.goBack(null)}
        />
      )
    };
  };

  componentWillMount() {
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
      // ESTO SE DEBERIA REEMPLAZAR POR UN TOAST
      this.setState({ cantDeleteUser: true });
    } else {
      this.props.onRegisterValueChange({
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

  renderCantDeleteUser = () => {
    return (
      <Menu
        title="No puedes eliminar tu cuenta porque tienes un negocio"
        onBackdropPress={() => this.setState({ cantDeleteUser: false })}
        isVisible={this.state.cantDeleteUser}
      >
        <MenuItem
          title="Cerrar"
          icon="md-close"
          onPress={() => this.setState({ cantDeleteUser: false })}
        />
      </Menu>
    );
  };

  onCommerceDeletePress = () => {
    if (this.props.commerceId) {
      this.props.onCommerceValueChange({
        prop: 'confirmDeleteVisible',
        value: true
      });
    } else {
      // ESTO SE DEBERIA REEMPLAZAR CON UN TOAST
      this.setState({ dontHaveCommerce: true });
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

  renderDontHaveCommerce = () => {
    return (
      <Menu
        title="No tienes ningun negocio"
        onBackdropPress={() => this.setState({ dontHaveCommerce: false })}
        isVisible={this.state.dontHaveCommerce}
      >
        <MenuItem
          title="Cerrar"
          icon="md-close"
          onPress={() => this.setState({ dontHaveCommerce: false })}
        />
      </Menu>
    );
  };

  onBackdropPress = () => {
    // auth
    this.props.onLoginValueChange({ prop: 'password', value: '' });
    this.props.onLoginValueChange({ prop: 'error', value: '' });
    // client
    this.props.onRegisterValueChange({
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
        <MenuItem
          title="Eliminar Mi Negocio"
          icon="md-trash"
          loadingWithText={this.props.loadingCommerceDelete}
          onPress={this.onCommerceDeletePress}
        />
        <MenuItem
          title="Eliminar Cuenta"
          icon="md-trash"
          loadingWithText={this.props.loadingUserDelete}
          onPress={this.onUserDeletePress}
        />
        {/* Opción en configuraciones para explicar y permitir mandar mail de configuracion*/}
        {/* <MenuItem
          title="Verificar mi Cuenta"
          icon="md-mail-open"
          onPress={}
        /> */}

        {this.renderConfirmUserDelete()}
        {this.renderCantDeleteUser()}
        {this.renderConfirmCommerceDelete()}
        {this.renderDontHaveCommerce()}
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
    onRegisterValueChange
  }
)(ClientSettings);
