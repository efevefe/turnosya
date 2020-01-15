import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CheckBox, Divider } from 'react-native-elements';
import { View, StyleSheet, Switch, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate,
  courtUpdate,
  onCourtNextReservationsRead
} from '../../actions';
import {
  CardSection,
  Input,
  Picker,
  Button,
  DatePicker,
  Toast,
  Menu,
  MenuItem
} from '../common';
import { validateValueType, trimString } from '../../utils';
import {
  MAIN_COLOR,
  MAIN_COLOR_DISABLED,
  GREY_DISABLED
} from '../../constants';

class CourtForm extends Component {
  state = {
    nameError: '',
    courtError: '',
    groundTypeError: '',
    priceError: '',
    lightPriceError: '',
    disabledFromError: '',
    disabledToError: '',
    selectedGrounds: [],
    lightPriceOpen: false,
    disabledPeriodModal: false,
    confirmationModal: false,
    reservationsToCancel: []
  };

  componentDidMount() {
    this.props.getCourtAndGroundTypes();

    if (this.props.lightPrice) this.setState({ lightPriceOpen: true });
    this.isCourtDisabled();
  }

  componentDidUpdate(prevProps) {
    if (this.props.grounds !== prevProps.grounds) {
      const firstIndex = this.props.courts.findIndex(
        item => item.value === this.props.court
      );

      if (firstIndex > -1)
        this.setState({ selectedGrounds: this.props.grounds[firstIndex] });
    }

    if (
      prevProps.disabledFrom !== this.props.disabledFrom ||
      prevProps.disabledTo !== this.props.disabledTo
    ) {
      this.renderDisabledDatesError();
    }

    // ver si hay reservas que estén en el periodo de deshabilitación de la cancha
    if (prevProps.nextReservations !== this.props.nextReservations) {
      this.disabledPeriodValidate();
    }
  }

  isCourtDisabled = () => {
    if (this.props.id && this.props.disabledTo > moment()) {
      this.props.onCourtValueChange({ disabled: true });
    }
  };

  onCourtSave = () => {
    const {
      id,
      name,
      court,
      ground,
      price,
      lightPrice,
      commerceId,
      navigation,
      disabledFrom,
      disabledTo
    } = this.props;
    const { reservationsToCancel } = this.state;

    if (id) {
      this.props.courtUpdate(
        {
          id,
          name,
          court,
          ground,
          price,
          lightPrice,
          commerceId,
          disabledFrom,
          disabledTo,
          reservationsToCancel
        },
        navigation
      );
    } else {
      this.props.courtCreate(
        {
          name,
          court,
          ground,
          price,
          lightPrice,
          disabledFrom,
          disabledTo,
          commerceId
        },
        navigation
      );
    }
  };

  renderNameError = () => {
    const name = trimString(this.props.name);

    this.props.onCourtValueChange({ name });
    if (name === '') {
      this.setState({ nameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ nameError: '' });
      return true;
    }
  };

  renderCourtError = () => {
    if (this.props.court === '') {
      this.setState({ courtError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ courtError: '' });
      return true;
    }
  };

  renderGroundTypeError = () => {
    if (this.props.ground === '') {
      this.setState({ groundTypeError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ groundTypeError: '' });
      return true;
    }
  };

  renderPriceError = () => {
    const price = this.props.price.trim();

    this.props.onCourtValueChange({ price });
    if (price === '') {
      this.setState({ priceError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('number', price)) {
      this.setState({ priceError: 'Debe ingresar un valor numérico' });
      return false;
    } else {
      this.setState({ priceError: '' });
      return true;
    }
  };

  renderLightPriceError = () => {
    if (this.state.lightPriceOpen) {
      const lightPrice = this.props.lightPrice.trim();

      this.props.onCourtValueChange({ lightPrice });
      if (lightPrice === '') {
        this.setState({ lightPriceError: 'Dato requerido' });
        return false;
      } else if (!validateValueType('number', lightPrice)) {
        this.setState({ lightPriceError: 'Debe ingresar un valor numérico' });
        return false;
      }
    }

    this.setState({ lightPriceError: '' });
    return true;
  };

  validateMinimumData = () => {
    return (
      this.renderNameError() &&
      this.renderCourtError() &&
      this.renderGroundTypeError() &&
      this.renderPriceError() &&
      this.renderLightPriceError() &&
      this.renderDisabledDatesError()
    );
  };

  onCourtTypeChangeHandle = (court, key) => {
    this.setState({ courtError: '' });

    if (key > 0) {
      if (this.props.grounds.length)
        this.setState({ selectedGrounds: this.props.grounds[key - 1] });
      this.props.onCourtValueChange({ court });
    } else {
      this.setState({ selectedGrounds: [] });
      this.props.onCourtValueChange({ court: '' });
    }
  };

  onGroundTypeChangeHandle = (ground, key) => {
    const { grounds, onCourtValueChange } = this.props;

    this.setState({ groundTypeError: '' });

    grounds !== null && key > 0
      ? onCourtValueChange({ ground })
      : onCourtValueChange({ ground: '' });
  };

  onCheckBoxPress = () => {
    if (this.state.lightPriceOpen) {
      this.props.onCourtValueChange({ lightPrice: '' });
    }
    this.setState({ lightPriceOpen: !this.state.lightPriceOpen });
  };

  renderLightPriceInput() {
    if (this.state.lightPriceOpen) {
      return (
        <CardSection>
          <Input
            label="Precio por turno (con luz):"
            placeholder="Precio de la cancha"
            keyboardType="numeric"
            value={this.props.lightPrice}
            errorMessage={this.state.lightPriceError}
            onChangeText={lightPrice =>
              this.props.onCourtValueChange({ lightPrice })
            }
            onFocus={() => this.setState({ lightPriceError: '' })}
            onBlur={this.renderLightPriceError}
          />
        </CardSection>
      );
    }
  }

  renderDisableCourtForm = () => {
    if (this.props.disabled) {
      return (
        <View>
          <CardSection
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              paddingBottom: 10
            }}
          >
            <DatePicker
              date={this.props.disabledFrom}
              mode="datetime"
              label="Desde:"
              placeholder="Fecha desde"
              errorMessage={this.state.disabledFromError}
              onDateChange={this.onDisabledFromValueChange}
            />
            <DatePicker
              date={this.props.disabledTo}
              mode="datetime"
              label="Hasta:"
              placeholder="Opcional"
              errorMessage={this.state.disabledToError}
              onDateChange={this.onDisabledToValueChange}
            />
          </CardSection>
          {this.props.disabledTo && (
            <CardSection>
              <CheckBox
                title="Agregar fecha de fin de hasta"
                iconType="material"
                checkedIcon="clear"
                uncheckedIcon="add"
                checkedColor={MAIN_COLOR}
                uncheckedColor={MAIN_COLOR}
                checkedTitle="Quitar fecha de hasta"
                checked={!!this.props.disabledTo}
                onPress={() =>
                  this.props.onCourtValueChange({ disabledTo: null })
                }
              />
            </CardSection>
          )}
        </View>
      );
    }
  };

  onDisableSwitch = disabled => {
    this.props.onCourtValueChange({ disabled });

    if (!disabled) {
      this.props.onCourtValueChange({ disabledFrom: null, disabledTo: null });
    }
  };

  onDisabledFromValueChange = date => {
    date = moment(date);

    if (moment().diff(date, 'seconds') > 30) {
      return Toast.show({
        text: 'No puede ingresar una fecha anterior a la actual'
      });
    }

    this.props.onCourtValueChange({ disabledFrom: date });
  };

  onDisabledToValueChange = date => {
    this.props.onCourtValueChange({ disabledTo: moment(date) });
  };

  renderDisabledDatesError = () => {
    if (this.props.disabled) {
      if (!this.props.disabledFrom) {
        this.setState({ disabledFromError: 'Dato requerido' });
        return false;
      } else if (
        this.props.disabledTo &&
        this.props.disabledFrom >= this.props.disabledTo
      ) {
        this.setState({
          disabledFromError: 'Debe ser anterior a la fecha de deshabilitación',
          disabledToError: 'Debe ser posterior a la fecha de habilitación'
        });
        return false;
      }
    }

    this.setState({ disabledFromError: '', disabledToError: '' });
    return true;
  };

  onSavePress = () => {
    this.setState({ reservationsToCancel: [] });

    if (this.validateMinimumData()) {
      if (this.props.disabled && this.props.id) {
        this.props.onCourtNextReservationsRead({
          commerceId: this.props.commerceId,
          courtId: this.props.id,
          startDate: this.props.disabledFrom,
          endDate: this.props.disabledTo
        });
      } else {
        this.onCourtSave();
      }
    }
  };

  disabledPeriodValidate = () => {
    if (this.props.nextReservations.length) {
      this.setState({ disabledPeriodModal: true });
    } else {
      this.onCourtSave();
    }
  };

  onSaveAndCancelReservations = () => {
    this.setState(
      {
        reservationsToCancel: this.props.nextReservations,
        confirmationModal: false
      },
      this.onCourtSave
    );
  };

  renderDisabledPeriodModal = () => {
    const { nextReservations } = this.props;

    if (nextReservations.length) {
      const firstReservationDate = nextReservations[0].startDate;
      const lastReservationDate =
        nextReservations[nextReservations.length - 1].endDate;

      return (
        <Menu
          title={
            'Tienes ' +
            nextReservations.length.toString() +
            ' reservas de esta cancha' +
            ' entre el ' +
            firstReservationDate.format('DD/MM/YYYY') +
            ' a las ' +
            firstReservationDate.format('HH:mm') +
            ' hs.' +
            ' y el ' +
            lastReservationDate.format('DD/MM/YYYY') +
            ' a las ' +
            lastReservationDate.format('HH:mm') +
            ' hs.' +
            ' Seleccione "Cancelar reservas y notificar" para cancelar dichas ' +
            'reservas y deshabilitar la cancha o "Volver" para cambiar el periodo ' +
            'de deshabilitación.'
          }
          onBackdropPress={() => this.setState({ disabledPeriodModal: false })}
          isVisible={this.state.disabledPeriodModal}
        >
          <MenuItem
            title="Cancelar reservas y notificar"
            icon="md-trash"
            onPress={() =>
              this.setState({
                confirmationModal: true,
                disabledPeriodModal: false
              })
            }
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Volver"
            icon="md-close"
            onPress={() => this.setState({ disabledPeriodModal: false })}
          />
        </Menu>
      );
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={20}>
        <Card containerStyle={styles.cardStyle}>
          <CardSection>
            <Input
              label="Nombre:"
              placeholder="Cancha 1"
              value={this.props.name}
              errorMessage={this.state.nameError || this.props.existsError}
              onChangeText={name => this.props.onCourtValueChange({ name })}
              onFocus={() => this.setState({ nameError: '' })}
              onBlur={this.renderNameError}
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de cancha:'}
              placeholder={{ value: null, label: 'Seleccionar...' }}
              value={this.props.court}
              items={this.props.courts}
              onValueChange={this.onCourtTypeChangeHandle}
              errorMessage={this.state.courtError}
            />
          </CardSection>

          <CardSection>
            <Picker
              title={'Tipo de suelo:'}
              placeholder={{ value: null, label: 'Seleccionar...' }}
              value={this.props.ground}
              items={this.state.selectedGrounds}
              onValueChange={this.onGroundTypeChangeHandle}
              disabled={this.state.selectedGrounds.length === 0}
              errorMessage={this.state.groundTypeError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Precio por turno (sin luz):"
              placeholder="Precio de la cancha"
              keyboardType="numeric"
              value={this.props.price}
              errorMessage={this.state.priceError}
              onChangeText={price => this.props.onCourtValueChange({ price })}
              onFocus={() => this.setState({ priceError: '' })}
              onBlur={this.renderPriceError}
            />
          </CardSection>

          {this.renderLightPriceInput()}

          <CardSection>
            <CheckBox
              title="Agregar precio con luz"
              iconType="material"
              checkedIcon="clear"
              uncheckedIcon="add"
              uncheckedColor={MAIN_COLOR}
              checkedColor={MAIN_COLOR}
              checkedTitle="Borrar precio con luz"
              checked={this.state.lightPriceOpen}
              onPress={this.onCheckBoxPress}
            />
          </CardSection>

          <Divider style={{ margin: 12 }} />

          <CardSection style={styles.disableCourtCardSection}>
            <View style={styles.disableCourtText}>
              <Text>Deshabilitar cancha:</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Switch
                onValueChange={this.onDisableSwitch}
                value={this.props.disabled}
                trackColor={{
                  false: GREY_DISABLED,
                  true: MAIN_COLOR_DISABLED
                }}
                thumbColor={this.props.disabled ? MAIN_COLOR : 'grey'}
              />
            </View>
          </CardSection>
          {this.renderDisableCourtForm()}
          <CardSection>
            <Button
              title="Guardar"
              loading={this.props.loading || this.props.loadingReservations}
              onPress={this.onSavePress}
            />
          </CardSection>
        </Card>

        {this.renderDisabledPeriodModal()}
        <Menu
          title="¿Está serguro que desea cancelar las reservas y guardar?"
          onBackdropPress={() => this.setState({ confirmationModal: false })}
          isVisible={this.state.confirmationModal}
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            onPress={this.onSaveAndCancelReservations}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ confirmationModal: false })}
          />
        </Menu>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  disableCourtCardSection: {
    paddingRight: 12,
    paddingLeft: 15,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  disableCourtText: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1
  }
});

const mapStateToProps = state => {
  const {
    id,
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    lightPrice,
    loading,
    existsError,
    disabled,
    disabledFrom,
    disabledTo
  } = state.courtForm;
  const { commerceId } = state.commerceData;
  const { nextReservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;

  return {
    id,
    name,
    courts,
    court,
    grounds,
    ground,
    price,
    lightPrice,
    loading,
    existsError,
    disabled,
    commerceId,
    disabledFrom,
    disabledTo,
    nextReservations,
    loadingReservations
  };
};

export default connect(mapStateToProps, {
  onCourtValueChange,
  getCourtAndGroundTypes,
  courtCreate,
  courtUpdate,
  onCourtNextReservationsRead
})(CourtForm);
