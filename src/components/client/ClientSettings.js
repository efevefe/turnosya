import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import firebase from 'firebase';
import moment from 'moment';
import { MenuItem, Menu, Input, CardSection, SettingsItem, Toast } from '../common';
import { isEmailVerified, cancelReservationNotificationFormat } from '../../utils';
import {
  onUserDelete,
  onCommerceDelete,
  onLoginValueChange,
  onCommerceValueChange,
  onClientDataValueChange,
  sendEmailVefification,
  onNextReservationsRead
} from '../../actions';

class ClientSettings extends Component {
  state = { providerId: null, deleteWithReservations: false, reservationsToCancel: [] };

  componentDidMount() {
    this.setState({
      providerId: firebase.auth().currentUser.providerData[0].providerId
    });
  }

  componentDidUpdate(prevProps) {
    // ver si el negocio tenia reservas pendientes
    if (prevProps.nextReservations !== this.props.nextReservations && this.props.navigation.isFocused())
      this.onCommerceDelete();
  }

  renderPasswordInput = () => {
    // muestra el input de contraseña para confirmar eliminacion de cuenta o negocio si ese es el metodo de autenticacion
    if (this.state.providerId === 'password') {
      return (
        <View style={{ alignSelf: 'stretch' }}>
          <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
            <Input
              label="Contraseña:"
              password
              value={this.props.password}
              color="black"
              onChangeText={password => this.props.onLoginValueChange({ password: password.trim() })}
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
      Toast.show({ text: 'No podés eliminar tu cuenta porque tenés un negocio' });
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
        <MenuItem title="Cancelar" icon="md-close" onPress={this.onBackdropPress} />
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
      this.props.onNextReservationsRead({
        commerceId: this.props.commerceId,
        startDate: moment()
      })

      this.setState({ reservationsToCancel: [] });
    } else {
      Toast.show({ text: 'No tienes ningún negocio' });
    }
  };

  onCommerceDelete = () => {
    if (this.props.nextReservations.length) {
      this.setState({ deleteWithReservations: true });
    } else {
      this.props.onCommerceValueChange({ confirmDeleteVisible: true });
    }
  }

  renderDeleteWithReservations = () => {
    return (
      <Menu
        title={
          'El negocio aún tiene reservas pendientes. ¿Está seguro de que desea eliminarlo? ' +
          'Seleccione la opción "Cancelar reservas y notificar" para dar de baja su negocio y cancelar dichas reservas, ' +
          'o la opción "Volver" si desea cancelar esta acción.'
        }
        onBackdropPress={() => this.setState({ deleteWithReservations: false })}
        isVisible={this.state.deleteWithReservations}
      >
        <MenuItem title="Cancelar reservas y notificar" icon="md-trash" onPress={this.onCancelReservations} />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem title="Volver" icon="md-close" onPress={() => this.setState({ deleteWithReservations: false })} />
      </Menu>
    );
  }

  onCancelReservations = () => {
    const reservationsToCancel = this.props.nextReservations.map(res => {
      return {
        ...res,
        notification: cancelReservationNotificationFormat({
          startDate: res.startDate,
          cancellationReason: 'Cierre del negocio'
        })
      }
    })

    this.setState({
      reservationsToCancel,
      deleteWithReservations: false
    }, () => this.props.onCommerceValueChange({ confirmDeleteVisible: true }));
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
        <MenuItem title="Cancelar" icon="md-close" onPress={this.onBackdropPress} />
      </Menu>
    );
  };

  onConfirmCommerceDelete = () => {
    if (this.state.providerId !== 'password') {
      this.onBackdropPress();
    }

    this.props.onCommerceDelete(this.props.password, this.state.reservationsToCancel);
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

    emailVerified ? Toast.show({ text: 'Su cuenta ya está verificada' }) : this.props.sendEmailVefification();
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
        {this.renderDeleteWithReservations()}
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
  const { nextReservations } = state.reservationsList;
  // auth
  const { password, error } = state.auth;

  return {
    loadingUserDelete,
    loadingCommerceDelete,
    commerceId,
    nextReservations,
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
  sendEmailVefification,
  onNextReservationsRead
})(ClientSettings);
