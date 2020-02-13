import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button, CardSection, ButtonGroup } from '../common';
import CourtReservationDetails from '../CourtReservationDetails';
import { validateValueType } from '../../utils';
import { onReservationValueChange, onCommerceCourtReservationCreate } from '../../actions';

class CommerceCourtReservationRegister extends Component {
  state = {
    selectedIndex: 0,
    priceButtons: [],
    prices: [],
    nameError: '',
    phoneError: ''
  };

  componentDidMount() {
    this.loading = false;
    this.priceButtons();
  }

  componentDidUpdate() {
    if (this.props.loading !== this.loading) {
      this.loading = this.props.loading;
    }
  }

  priceButtons = () => {
    const { court } = this.props;
    const priceButtons = [];
    const prices = [];

    if (court) {
      priceButtons.push(`Sin Luz: $${court.price}`);
      prices.push(court.price);

      if (court.lightPrice) {
        priceButtons.push(`Con Luz: $${court.lightPrice}`);
        prices.push(court.lightPrice);
      }
    }

    this.setState({ priceButtons, prices }, () => this.onPriceSelect(0));
  };

  onPriceSelect = selectedIndex => {
    this.setState({ selectedIndex });
    this.props.onReservationValueChange({
      price: this.state.prices[selectedIndex],
      light: !!selectedIndex // 0 = false = no light // 1 = true = light
    });
  };

  renderInputs = () => {
    if (!this.props.saved) {
      return (
        <View>
          <CardSection>
            <ButtonGroup
              onPress={this.onPriceSelect}
              selectedIndex={this.state.selectedIndex}
              buttons={this.state.priceButtons}
              textStyle={{ fontSize: 14 }}
            />
          </CardSection>
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
              onChangeText={clientPhone => this.props.onReservationValueChange({ clientPhone })}
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
      this.setState({ nameError: 'Formato no válido' });
    } else {
      this.setState({ nameError: '' });
      return false;
    }
  };

  phoneError = () => {
    const { clientPhone } = this.props;

    if (clientPhone && !validateValueType('phone', clientPhone)) {
      this.setState({ phoneError: 'Formato no válido' });
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

      const { commerceId, areaId, clientName, clientPhone, court, startDate, endDate, light, price } = this.props;

      this.props.onCommerceCourtReservationCreate({
        commerceId,
        areaId,
        courtId: court.id,
        courtType: court.court,
        clientName,
        clientPhone,
        startDate,
        endDate,
        light,
        price
      });
    }
  };

  render() {
    const { clientName, clientPhone, court, startDate, endDate, light, price, saved } = this.props;

    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60} contentContainerStyle={{ flexGrow: 1 }}>
        <CourtReservationDetails
          name={saved && clientName}
          info={saved && clientPhone}
          infoIcon="ios-call"
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={saved}
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
    area: { areaId }
  } = state.commerceData;
  const {
    clientName,
    clientPhone,
    court,
    startDate,
    endDate,
    light,
    price,
    saved,
    exists,
    loading
  } = state.reservation;

  return {
    commerceId,
    areaId,
    clientName,
    clientPhone,
    court,
    startDate,
    endDate,
    light,
    price,
    saved,
    exists,
    loading
  };
};

export default connect(mapStateToProps, {
  onReservationValueChange,
  onCommerceCourtReservationCreate
})(CommerceCourtReservationRegister);
