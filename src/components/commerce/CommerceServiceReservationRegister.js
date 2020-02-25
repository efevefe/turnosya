import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button, CardSection } from '../common';
import ServiceReservationDetails from '../ServiceReservationDetails';
import { onReservationValueChange, onCommerceServiceReservationCreate } from '../../actions';
import { validateValueType, newReservationNotificationFormat } from '../../utils';

class CommerceCourtReservationRegister extends Component {
  state = { nameError: '', phoneError: '' };

  componentDidMount() {
    this.loading = false;
  }

  componentDidUpdate(prevProps) {
    if ((this.props.saved && !prevProps.saved) || (this.props.exists && !prevProps.exists)) {
      this.props.navigation.goBack();
    }

    if (this.props.loading !== this.loading) {
      this.loading = this.props.loading;
    }
  }

  renderInputs = () => {
    if (!this.props.saved) {
      return (
        <View>
          <CardSection style={styles.cardSection}>
            <Input
              label="Nombre:"
              placeholder="Nombre del cliente"
              autoCapitalize="words"
              value={this.props.clientName}
              onChangeText={clientName => this.props.onReservationValueChange({ clientName })}
              errorMessage={this.state.nameError}
              onFocus={() => this.setState({ nameError: '' })}
              onBlur={this.nameError}
            />
          </CardSection>
          <CardSection style={styles.cardSection}>
            <Input
              label="Teléfono:"
              placeholder="Teléfono del cliente (opcional)"
              value={this.props.clientPhone}
              onChangeText={clientPhone => this.props.onReservationValueChange({ clientPhone: clientPhone.trim() })}
              errorMessage={this.state.phoneError}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.phoneError}
            />
          </CardSection>
        </View>
      );
    }
  };

  nameError = () => {
    const { clientName } = this.props;

    if (!clientName) {
      this.setState({ nameError: 'Dato requerido' });
    } else if (!validateValueType('name', clientName)) {
      this.setState({ nameError: 'Formato no valido' });
    } else {
      this.setState({ nameError: '' });
      return false;
    }

    return true;
  };

  phoneError = () => {
    if (this.props.clientPhone && !validateValueType('phone', this.props.clientPhone)) {
      this.setState({ phoneError: 'Formato no valido' });
      return true;
    } else {
      this.setState({ phoneError: '' });
      return false;
    }
  };

  renderButtons = () => {
    if (!this.props.saved && !this.props.exists) {
      return (
        <CardSection>
          <Button title="Confirmar Reserva" loading={this.loading} onPress={this.onConfirmReservation} />
        </CardSection>
      );
    }
  };

  onConfirmReservation = () => {
    if (!this.nameError() && !this.phoneError() && !this.loading) {
      this.loading = true;

      const {
        commerceName,
        commerceId,
        areaId,
        clientName,
        clientPhone,
        employeeId,
        selectedEmployeeId,
        service,
        startDate,
        endDate,
        price
      } = this.props;

      let notification = null;

      if (employeeId !== selectedEmployeeId)
        notification = newReservationNotificationFormat({
          startDate,
          service: service.name,
          actorName: clientName,
          receptorName: commerceName
        });

      this.props.onCommerceServiceReservationCreate({
        commerceId,
        areaId,
        serviceId: service.id,
        employeeId: selectedEmployeeId,
        clientName,
        clientPhone,
        startDate,
        endDate,
        price,
        notification
      });
    }
  };

  render() {
    const { clientName, clientPhone, service, startDate, endDate, price, saved } = this.props;

    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60} contentContainerStyle={{ flexGrow: 1 }}>
        <ServiceReservationDetails
          name={saved && clientName}
          info={saved && clientPhone}
          infoIcon="ios-call"
          service={service}
          startDate={startDate}
          endDate={endDate}
          price={price}
        />
        {this.renderInputs()}
        <View style={styles.confirmButtonContainer}>{this.renderButtons()}</View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardSection: {
    paddingHorizontal: 10
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

const mapStateToProps = state => {
  const {
    commerceId,
    name: commerceName,
    area: { areaId }
  } = state.commerceData;
  const { clientName, clientPhone, service, startDate, endDate, price, saved, exists, loading } = state.reservation;
  const { employeeId } = state.roleData;
  const { selectedEmployeeId } = state.employeesList;

  return {
    commerceName,
    commerceId,
    areaId,
    clientName,
    clientPhone,
    service,
    employeeId,
    startDate,
    endDate,
    price,
    saved,
    exists,
    selectedEmployeeId,
    loading
  };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onCommerceServiceReservationCreate
})(CommerceCourtReservationRegister);
