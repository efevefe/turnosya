import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl, Text } from 'react-native';
import { Divider, Card, Slider, CheckBox } from 'react-native-elements';
import { Fab } from 'native-base';
import moment from 'moment';
import { HeaderBackButton } from 'react-navigation-stack';
import { MAIN_COLOR, MAIN_COLOR_OPACITY, DAYS, MONTHS } from '../../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';
import { hourToDate, formattedMoment, stringFormatMinutes } from '../../utils';
import { Spinner, IconButton, EmptyList, Menu, MenuItem, DatePicker, CardSection, Toast } from '../common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead,
  onScheduleUpdate,
  onNextReservationsRead
} from '../../actions';

class ScheduleRegister extends Component {
  state = {
    incompatibleScheduleVisible: false,
    incompatibleEndDateVisible: false,
    reservationsAfterEndDate: [],
    notCoveredReservations: [],
    reservationsToCancel: [],
    prevSchedule: null,
    startDateError: '',
    endDateError: '',
    sliderValues: {
      reservationMinFrom: 10,
      reservationMinTo: 240,
      reservationMinValue: 60
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderBackButton()
    });

    const prevSchedule = this.props.navigation.getParam('schedule');
    prevSchedule && this.setState({ prevSchedule });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextReservations !== this.props.nextReservations) {
      // verificar tambien si no se produjo un error al leer las reservas
      this.workShiftsValidate();
    }

    if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
      this.renderStartDateError();
      this.renderEndDateError();
    }
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor="white" />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onBackPress = () => {
    // aca deberia verificar si hay cambios no guardados y preguntar si quiere descartar

    this.props.navigation.goBack();
    // this.props.onScheduleRead({
    //   commerceId: this.props.commerceId,
    //   selectedDate: this.props.navigation.getParam('selectedDate')
    // });
  };

  // bien
  onSavePress = () => {
    if (!this.validateMinimumData()) {
      return Toast.show({ text: 'Hay datos faltantes o incorrectos. Revise los mismos e intente nuevamente.' });
    }

    this.setState({ reservationsToCancel: [] });

    let startDate = formattedMoment();
    let { endDate, commerceId } = this.props;
    const { prevSchedule } = this.state;

    if (prevSchedule && prevSchedule.startDate > startDate)
      startDate = prevSchedule.startDate;

    if (prevSchedule) endDate = prevSchedule.endDate;

    if (JSON.stringify(this.props.prevSchedule) !== JSON.stringify(this.state.prevSchedule)) {
      return this.props.onNextReservationsRead({
        commerceId,
        startDate,
        endDate
      });
    }

    this.props.navigation.goBack();
  }

  // bien
  validateMinimumData = () => {
    const { cards, startDate, endDate } = this.props;

    if (endDate && (startDate >= endDate)) return false;
    if (!cards.length) return false;

    for (i in cards) {
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      if (!firstShiftStart || !firstShiftEnd) return false;
      if (firstShiftStart >= firstShiftEnd) return false;
      if ((secondShiftStart && !secondShiftEnd) || (!secondShiftStart && secondShiftEnd)) return false;
      if (secondShiftStart && (secondShiftStart >= secondShiftEnd)) return false;
      if (secondShiftStart && (secondShiftStart <= firstShiftEnd)) return false;
      if (!days.length) return false;
    }

    return true;
  }

  workShiftsValidate = () => {
    const { nextReservations } = this.props;
    const { prevSchedule } = this.state;

    if (nextReservations) {
      // si hay reservas en el periodo de vigencia del horario que estamos modificando o creando

      // si estamos modificando horarios y cambiamos las fechas de inicio y fin de vigencia
      // de modo que estan quedando afuera resevas que antes eran cubiertas por este horario
      if (prevSchedule && !this._validEndDate()) return;

      // si no es compatible con reservas existentes dentro del periodo definido
      if (!this._compatibleSchedule()) return;
    }

    // no hay reservas o si las hay, no entran en conflicto
    return this.onScheduleSave();
  }

  // bien
  _compatibleSchedule = () => {
    const { nextReservations, cards, startDate, endDate } = this.props;

    let notCoveredReservations = nextReservations.filter(res => {
      return (res.startDate >= startDate && (!endDate || (endDate && res.endDate <= endDate)))
    })

    for (i in cards) {
      // nuevos horarios de atencion
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      // se verifica si los nuevos horarios abarcan las (startDate, endDate) de los turnos proximos
      notCoveredReservations = this._compatibleShift(firstShiftStart, firstShiftEnd, days, notCoveredReservations);

      // si existen segundos horarios, se verifica lo mismo que los primeros horarios
      if (notCoveredReservations.length && secondShiftStart && secondShiftEnd) {
        notCoveredReservations = this._compatibleShift(secondShiftStart, secondShiftEnd, days, notCoveredReservations);
      }

      if (notCoveredReservations.length) {
        this.setState({
          notCoveredReservations,
          incompatibleScheduleVisible: true
        });
        return false;
      }
    }

    return true;
  }

  // bien
  _compatibleShift = (shiftStart, shiftEnd, days, notCoveredReservations) => {
    const { reservationMinLength } = this.props;

    notCoveredReservations = notCoveredReservations.filter(reservation => {
      const { startDate, endDate } = reservation;
      const shiftStartDate = hourToDate(shiftStart, startDate);
      const shiftEndDate = hourToDate(shiftEnd, startDate);

      if (startDate >= shiftStartDate && endDate <= shiftEndDate) {
        const startDiff = Math.abs(shiftStartDate.diff(startDate, 'minutes'));
        const reservationDuration = Math.abs(startDate.diff(endDate, 'minutes'));

        return (
          // en el caso en que un turno pueda ocupar varios slots se
          // reemplazaria la primer comparacion por esta que esta comentada
          // (reservationDuration % reservationMinLength) ||
          (reservationDuration !== reservationMinLength) ||
          (startDiff % reservationMinLength) ||
          !days.includes(startDate.day())
        );
      }

      return true;
    })

    return notCoveredReservations;
  }

  // bien
  _validEndDate = () => {
    const { nextReservations } = this.props;
    const newStartDate = this.props.startDate;
    const newEndDate = this.props.endDate;
    const { startDate, endDate } = this.state.prevSchedule;

    if (((!endDate && newEndDate) ||
      (endDate && newEndDate && (newEndDate < endDate)))
      && (startDate < newStartDate)) {

      const reservationsAfterEndDate = nextReservations.filter(res => {
        return (res.startDate >= newEndDate);
      });

      if (reservationsAfterEndDate.length) {
        this.setState({
          reservationsAfterEndDate,
          incompatibleEndDateVisible: true
        });

        return false;
      }
    }

    return true;
  }

  onAddPress = () => {
    const { cards, selectedDays, onScheduleValueChange } = this.props;

    if (cards.length === 0) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([{ ...emptyCard, id: 0 }])
      });
    } else if (
      selectedDays.length < 7 &&
      !this.props.cards.find(card => card.days.length === 0)
    ) {
      onScheduleValueChange({
        prop: 'cards',
        value: cards.concat([
          { ...emptyCard, id: parseInt(cards[cards.length - 1].id) + 1 }
        ])
      });
    }
  };

  onStartDateValueChange = startDate => {
    startDate = moment(startDate);

    if (startDate < formattedMoment()) {
      return Toast.show({ text: 'No puede ingresar una fecha pasada' });
    }

    this.props.onScheduleValueChange({
      prop: 'startDate',
      value: startDate
    })
  }

  renderStartDateError = () => {
    const { startDate, endDate } = this.props;

    if (endDate && (startDate >= endDate)) {
      this.setState({ startDateError: 'Debe ser anterior a la fecha de fin de vigencia' });
    } else if (!startDate) {
      this.setState({ startDateError: 'Debe seleccionar una fecha' });
    } else {
      this.setState({ startDateError: '' });
      return true;
    }

    return false;
  }

  onEndDateValueChange = endDate => {
    endDate = moment(endDate);

    if (endDate < formattedMoment()) {
      return Toast.show({ text: 'No puede ingresar una fecha pasada' });
    }

    this.props.onScheduleValueChange({
      prop: 'endDate',
      value: endDate
    })
  }

  renderEndDateError = () => {
    const { startDate, endDate } = this.props;

    if (endDate && (startDate >= endDate)) {
      this.setState({ endDateError: 'Debe ser posterior a la fecha de fin de vigencia' });
    } else {
      this.setState({ endDateError: '' });
      return true;
    }

    return false;
  }

  onScheduleSave = async () => {
    let {
      commerceId,
      scheduleId,
      cards,
      reservationMinLength,
      reservationDayPeriod,
      startDate,
      endDate,
      schedules,
      navigation
    } = this.props;
    const { reservationsToCancel } = this.state;

    if (startDate < formattedMoment()) startDate = formattedMoment();

    if (this.validateMinimumData()) {
      await this.props.onScheduleUpdate(
        {
          commerceId,
          scheduleId,
          cards,
          reservationMinLength,
          reservationDayPeriod,
          startDate,
          endDate,
          schedules,
          reservationsToCancel
        },
        navigation
      );
    }

    // aca no va el goback, pero si la consulta
    // this.onBackPress();
  }

  renderIncompatibleScheduleModal = () => {
    const { notCoveredReservations, incompatibleScheduleVisible } = this.state;
    const lastReservation = notCoveredReservations[notCoveredReservations.length - 1];
    const lastReservationDate = lastReservation ? lastReservation.startDate : null;

    if (lastReservationDate && incompatibleScheduleVisible) {
      return (
        <Menu
          title={
            'Los nuevos horarios de atencion entraran en vigencia luego del ' +
            DAYS[lastReservationDate.day()] + ' ' +
            lastReservationDate.format('D') + ' de ' +
            MONTHS[lastReservationDate.month()] + ' ' +
            'debido a que entran en conflicto con una o mas reservas existentes ' +
            'hasta esa fecha. Seleccione "Aceptar" ' +
            'para confirmar estos cambios o "Cancelar reservas y notificar" para ' +
            'iniciar la vigencia en la fecha ingresada'
          }
          onBackdropPress={() => this.setState({ incompatibleScheduleVisible: false })}
          isVisible={incompatibleScheduleVisible}
        >
          <MenuItem
            title="Acepar"
            icon="md-checkmark"
            onPress={() => this.onSetNewStartDate(lastReservationDate)}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar reservas y notificar"
            icon="md-trash"
            onPress={this.onIncompatibleScheduleSave}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ incompatibleScheduleVisible: false })}
          />
        </Menu>
      );
    }
  }

  onSetNewStartDate = newStartDate => {
    this.props.onScheduleValueChange({
      prop: 'startDate',
      value: formattedMoment(newStartDate).add(1, 'days')
    });

    this.setState({ incompatibleScheduleVisible: false }, this.onScheduleSave);
  }

  onIncompatibleScheduleSave = () => {
    const { reservationsToCancel, notCoveredReservations } = this.state;

    this.setState({
      reservationsToCancel: [...reservationsToCancel, notCoveredReservations],
      incompatibleScheduleVisible: false
    }, this.onScheduleSave);
  }

  renderIncompatibleEndDateModal = () => {
    const { reservationsAfterEndDate, incompatibleEndDateVisible } = this.state;
    const lastReservation = reservationsAfterEndDate[reservationsAfterEndDate.length - 1];
    const lastReservationDate = lastReservation ? lastReservation.startDate : null;

    if (lastReservationDate && incompatibleEndDateVisible) {
      return (
        <Menu
          title={
            'Tienes reservas hasta el ' +
            DAYS[lastReservationDate.day()] + ' ' +
            lastReservationDate.format('D') + ' de ' +
            MONTHS[lastReservationDate.month()] + ' ' +
            '¿Desea establecer el fin de vigencia luego de esta fecha?. ' +
            'Seleccione "Aceptar" confirmar estos cambios o ' +
            '"Cancelar reservas y notificar" para cancelar dichas reservas ' +
            'y establecer la fecha ingresada como fin de vigencia'
          }
          onBackdropPress={() => this.setState({ incompatibleEndDateVisible: false })}
          isVisible={incompatibleEndDateVisible}
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            onPress={() => this.onSetNewEndDate(lastReservationDate)}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar reservas y notificar"
            icon="md-trash"
            onPress={this.onIncompatibleEndDateSave}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Volver"
            icon="md-close"
            onPress={() => this.setState({ incompatibleEndDateVisible: false })}
          />
        </Menu>
      );
    }
  }

  onSetNewEndDate = newEndDate => {
    this.props.onScheduleValueChange({
      prop: 'endDate',
      value: formattedMoment(newEndDate).add(1, 'days')
    });

    this.setState({ incompatibleEndDateVisible: false }, this._compatibleSchedule);
  }

  onIncompatibleEndDateSave = () => {
    const { reservationsToCancel, reservationsAfterEndDate } = this.state;

    this.setState({
      reservationsToCancel: [...reservationsToCancel, reservationsAfterEndDate],
      incompatibleEndDateVisible: false
    }, this._compatibleSchedule);
  }

  renderRow = ({ item }) => {
    return (
      <ScheduleRegisterItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList = () => {
    const { cards, refreshing, loadingReservations } = this.props;

    if (cards.length > 0) {
      return (
        <FlatList
          data={cards}
          renderItem={this.renderRow}
          keyExtractor={card => card.id.toString()}
          extraData={this.props}
          contentContainerStyle={{ paddingBottom: 95 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || loadingReservations}
              colors={[MAIN_COLOR]}
              tintColor={MAIN_COLOR}
            />
          }
        />
      );
    }

    return <EmptyList title="No hay horarios de atencion" />;
  };

  render() {
    const { reservationMinFrom, reservationMinTo, reservationMinValue } = this.state.sliderValues;

    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <Card containerStyle={{ borderRadius: 10, padding: 5, paddingTop: 10 }}>
          <CardSection
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around'
            }}
          >
            <DatePicker
              date={this.props.startDate || formattedMoment()}
              mode="date"
              label="Inicio de vigencia:"
              placeholder="Fecha de inicio"
              errorMessage={this.state.startDateError}
              onDateChange={this.onStartDateValueChange}
            />
            <DatePicker
              date={this.props.endDate}
              mode="date"
              label="Fin de vigencia:"
              placeholder="Opcional"
              errorMessage={this.state.endDateError}
              onDateChange={this.onEndDateValueChange}
            />
          </CardSection>
          {this.props.endDate &&
            <CardSection>
              <CheckBox
                title="Agregar fecha de fin de vigencia"
                iconType="material"
                checkedIcon="clear"
                uncheckedIcon="add"
                checkedColor={MAIN_COLOR}
                uncheckedColor={MAIN_COLOR}
                checkedTitle="Quitar fecha de fin de vigencia"
                checked={!!this.props.endDate}
                onPress={() => this.props.onScheduleValueChange({ prop: 'endDate', value: null })}
              />
            </CardSection>}
          <CardSection style={{ paddingHorizontal: 20, paddingTop: 15 }}>
            <Text>
              {'Duración mínima de turnos: ' +
                stringFormatMinutes(reservationMinValue)}
            </Text>
            <Slider
              animationType="spring"
              minimumTrackTintColor={MAIN_COLOR_OPACITY}
              minimumValue={reservationMinFrom}
              maximumValue={reservationMinTo}
              step={reservationMinFrom}
              thumbTouchSize={{ width: 60, height: 60 }}
              thumbTintColor={MAIN_COLOR}
              value={reservationMinValue}
              onSlidingComplete={value => this.props.onScheduleValueChange({ prop: 'reservationMinLength', value })}
              onValueChange={value => this.setState({
                sliderValues: {
                  ...this.state.sliderValues,
                  reservationMinValue: value
                }
              })}
            />
          </CardSection>
        </Card>

        {this.renderList()}
        {this.renderIncompatibleScheduleModal()}
        {this.renderIncompatibleEndDateModal()}

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={this.onAddPress}
        >
          <Ionicons name="md-add" />
        </Fab>
      </View>
    );
  }
}

const emptyCard = {
  firstShiftStart: '',
  firstShiftEnd: '',
  secondShiftStart: null,
  secondShiftEnd: null,
  days: []
};

const mapStateToProps = state => {
  const {
    id,
    cards,
    selectedDays,
    reservationMinLength,
    reservationDayPeriod,
    startDate,
    endDate,
    schedules,
    error,
    loading,
    refreshing
  } = state.commerceSchedule;
  const { nextReservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { commerceId } = state.commerceData;

  return {
    scheduleId: id,
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
    startDate,
    endDate,
    schedules,
    error,
    loading,
    loadingReservations,
    refreshing,
    nextReservations
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleCreate,
    onScheduleRead,
    onScheduleUpdate,
    onNextReservationsRead
  }
)(ScheduleRegister);
