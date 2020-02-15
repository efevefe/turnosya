import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import firebase from 'firebase';
import { onCommerceDelete, onCommerceValueChange, onLoginValueChange } from '../../actions';
import { MenuItem, Menu, Input, CardSection, SettingsItem } from '../common';

class CommerceSettings extends Component {
  state = { providerId: null, mPagoModalVisible: false };

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
          <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
            <Input
              label="Contraseña:"
              password
              value={this.props.password}
              color="black"
              onChangeText={password => this.props.onLoginValueChange({ password })}
              errorMessage={this.props.reauthError}
              onFocus={() => this.props.onLoginValueChange({ error: '' })}
            />
          </CardSection>
          <Divider style={{ backgroundColor: 'grey' }} />
        </View>
      );
    }
  };

  renderConfirmCommerceDelete = () => {
    // ventana de confirmación para eliminar negocio
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
        <MenuItem title="Cancelar" icon="md-close" onPress={this.onBackdropPress} />
      </Menu>
    );
  };

  onConfirmCommerceDelete = () => {
    if (this.state.providerId != 'password') {
      this.onBackdropPress();
    }

    this.props.onCommerceDelete(this.props.password, this.props.navigation);
  };

  onBackdropPress = () => {
    // auth
    this.props.onLoginValueChange({ password: '', error: '' });
    // commerce
    this.props.onCommerceValueChange({ confirmDeleteVisible: false });
  };

  render() {
    return (
      <ScrollView style={styles.containerStyle}>
        <SettingsItem
          leftIcon={{
            name: 'md-card',
            type: 'ionicon',
            color: 'black'
          }}
          title="Configurar cobro con Mercado Pago"
          onPress={() => this.props.navigation.navigate('paymentSettings')}
          bottomDivider
        />
        <SettingsItem
          leftIcon={{
            name: 'md-trash',
            type: 'ionicon',
            color: 'black'
          }}
          title="Eliminar mi negocio"
          onPress={() => this.props.onCommerceValueChange({ confirmDeleteVisible: true })}
          loading={this.props.loadingCommerceDelete}
          bottomDivider
        />
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
  // commerce
  const loadingCommerceDelete = state.commerceData.loading;
  const confirmCommerceDeleteVisible = state.commerceData.confirmDeleteVisible;
  const { commerceId } = state.commerceData;
  // auth
  const { password, error } = state.auth;

  return {
    loadingCommerceDelete,
    password,
    reauthError: error,
    confirmCommerceDeleteVisible,
    commerceId
  };
};

export default connect(mapStateToProps, {
  onCommerceDelete,
  onCommerceValueChange,
  onLoginValueChange
})(CommerceSettings);
