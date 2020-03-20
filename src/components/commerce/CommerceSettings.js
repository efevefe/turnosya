import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Divider } from 'react-native-elements';
import firebase from 'firebase';
import { cancelReservationNotificationFormat } from '../../utils';
import { onCommerceDelete, onCommerceValueChange, onLoginValueChange, onNextReservationsRead } from '../../actions';
import { MenuItem, Menu, Input, CardSection, SettingsItem } from '../common';

class CommerceSettings extends Component {
  state = { providerId: null, mPagoModalVisible: false, deleteWithReservations: false, reservationsToCancel: [] };

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

  onCommerceDeletePress = () => {
    this.props.onNextReservationsRead({
      commerceId: this.props.commerceId,
      startDate: moment()
    })

    this.setState({ reservationsToCancel: [] });
  }

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
          actorName: this.props.commerceName,
          cancellationReason: 'Cierre del negocio'
        })
      }
    })

    this.setState({
      reservationsToCancel,
      deleteWithReservations: false
    }, () => this.props.onCommerceValueChange({ confirmDeleteVisible: true }));
  };


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

    this.props.onCommerceDelete(this.props.password, this.state.reservationsToCancel, this.props.navigation);
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
          onPress={this.onCommerceDeletePress}
          loading={this.props.loadingCommerceDelete}
          bottomDivider
        />
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
  // commerce
  const loadingCommerceDelete = state.commerceData.loading;
  const confirmCommerceDeleteVisible = state.commerceData.confirmDeleteVisible;
  const { commerceId, name: commerceName } = state.commerceData;
  // auth
  const { password, error } = state.auth;

  const { nextReservations } = state.reservationsList;

  return {
    loadingCommerceDelete,
    password,
    reauthError: error,
    confirmCommerceDeleteVisible,
    commerceId,
    nextReservations,
    commerceName
  };
};

export default connect(mapStateToProps, {
  onCommerceDelete,
  onCommerceValueChange,
  onLoginValueChange,
  onNextReservationsRead
})(CommerceSettings);
