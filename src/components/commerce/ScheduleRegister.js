import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl, Text } from 'react-native';
import { Divider, Card, Slider, CheckBox } from 'react-native-elements';
import { Fab } from 'native-base';
import moment from 'moment';
import { MAIN_COLOR, MAIN_COLOR_OPACITY, DAYS, MONTHS } from '../../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';
import { hourToDate, formattedMoment, stringFormatMinutes } from '../../utils';
import { Spinner, IconButton, EmptyList, Menu, MenuItem, DatePicker, CardSection, Toast } from '../common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead,
  onScheduleUpdate,
  onNextReservationsRead,
  onActiveSchedulesRead
} from '../../actions';

class ScheduleRegister extends Component {
  state = {
    incompatibleScheduleVisible: false,
    incompatibleEndDateVisible: false,
    reservationsAfterEndDate: [],
    notCoveredReservations: [],
    reservationsToCancel: [],
    prevSchedule: null,
    overlappedSchedule: null,
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
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderSaveButton()
    });

    const prevSchedule = this.props.navigation.getParam('schedule');
    prevSchedule && this.setState({ prevSchedule });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextReservations !== this.props.nextReservations) {
      this.workShiftsValidate();
    }

    if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
      this.renderStartDateError();
      this.renderEndDateError();
    }
  }

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onSavePress = () => {
    if (!this.validateMinimumData()) return;

    let { startDate, endDate, commerceId, schedules } = this.props;
    const { prevSchedule } = this.state;

    // el overlapped schedule es un schedule cuyo periodo de vigencia abarca el periodo de
    // vigencia del schedule que estamos modificando o creando
    const overlappedSchedule = schedules.find(schedule => {
      return (
        (startDate > schedule.startDate) &&
        ((!schedule.endDate && endDate) ||
          (schedule.endDate && endDate && endDate < schedule.endDate))
      );
    });

    if (prevSchedule) {
      endDate = prevSchedule.endDate;
    } else {
      if (overlappedSchedule) {
        endDate = overlappedSchedule.endDate;
      }
    }

    this.setState({ reservationsToCancel: [], overlappedSchedule });

    if (!prevSchedule || this.didChanges()) {
      return this.props.onNextReservationsRead({
        commerceId,
        startDate,
        endDate
      });
    }

    this.props.navigation.goBack();
  }

  didChanges = () => {
    // esta funcion verifica si se hizo algun cambio en los horarios de atencion
    // el tiempo minimo de turno o las fechas de vigencia para que en caso de que no
    // hubo cambios, no se ejcute lo mismo el update en la base de datos

    const oldStartDate = this.state.prevSchedule.startDate;
    const oldEndDate = this.state.prevSchedule.endDate;
    const prevSchedule = {
      cards: this.state.prevSchedule.cards,
      reservationMinLength: this.state.prevSchedule.reservationMinLength
    };

    const newStartDate = this.props.startDate;
    const newEndDate = this.props.endDate;
    const newSchedule = {
      cards: this.props.cards,
      reservationMinLength: this.props.reservationMinLength
    }

    if (JSON.stringify(prevSchedule) !== JSON.stringify(newSchedule)) return true;
    if (!!oldEndDate !== !!newEndDate) return true;
    if (oldEndDate && newEndDate && oldEndDate.diff(newEndDate, 'minutes')) return true;
    if (oldStartDate <= formattedMoment() && newStartDate.diff(formattedMoment(), 'minutes')) return true;
    if (oldStartDate >= formattedMoment() && newStartDate.diff(oldStartDate, 'minutes')) return true;
  }

  validateMinimumData = () => {
    // esta funcion valida en conjunto que se hayan ingresado todos los datos requeridos
    // y que los mismos sean correctos, antes de pasar a validar la compatibilidad de los horarios

    const { cards, startDate, endDate } = this.props;
    let error = false;

    if ((endDate && (startDate >= endDate)) || (!cards.length)) error = true;

    for (i in cards) {
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      if (
        (!firstShiftStart || !firstShiftEnd) ||
        (firstShiftStart >= firstShiftEnd) ||
        (!!secondShiftStart !== !!secondShiftEnd) ||
        (secondShiftStart && (secondShiftStart >= secondShiftEnd)) ||
        (secondShiftStart && (secondShiftStart <= firstShiftEnd)) ||
        (!days.length)
      ) {
        error = true;
        break;
      }
    }

    if (error) {
      Toast.show({ text: 'Hay datos faltantes o incorrectos. Revise los mismos e intente nuevamente.' });
    }

    return !error;
  }

  workShiftsValidate = () => {
    const { nextReservations } = this.props;

    if (nextReservations) {
      // si hay reservas en el periodo de vigencia del horario que estamos modificando o creando

      // si estamos modificando horarios y cambiamos las fechas de inicio y fin de vigencia
      // de modo que estan quedando afuera resevas que antes eran cubiertas por este horario
      if (!this.validEndDate()) return;

      // verifica si no es compatible con reservas existentes dentro del periodo definido
      return this.compatibleSchedule()
    }

    // no hay reservas o si las hay, no entran en conflicto
    this.onScheduleSave();
  }

  compatibleSchedule = () => {
    // esta funcion toma las reservas existentes (en caso de que haya) que se encuentran 
    // en el periodo del schedule que estamos creando o modificando para ver si hay algun conflicto

    const { nextReservations, cards, startDate, endDate } = this.props;

    let notCoveredReservations = nextReservations.filter(res => {
      return (res.startDate >= startDate && (!endDate || (endDate && res.endDate <= endDate)))
    })

    for (i in cards) {
      // nuevos horarios de atencion
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      // se verifica si los nuevos horarios abarcan las (startDate, endDate) de los turnos proximos
      notCoveredReservations = this.compatibleShift(firstShiftStart, firstShiftEnd, days, notCoveredReservations);

      // si existen segundos horarios, se verifica lo mismo que los primeros horarios
      if (notCoveredReservations.length && secondShiftStart && secondShiftEnd) {
        notCoveredReservations = this.compatibleShift(secondShiftStart, secondShiftEnd, days, notCoveredReservations);
      }

      if (notCoveredReservations.length) {
        return this.setState({
          notCoveredReservations,
          incompatibleScheduleVisible: true
        });
      }
    }

    // si no hay conflictos guarda
    this.onScheduleSave();
  }

  compatibleShift = (shiftStart, shiftEnd, days, notCoveredReservations) => {
    // esta funcion se ejecuta por cada card, y evalua en funcion de los horarios de atencion
    // y la duracion de los turnos, si las reservas existentes aun son compatibles, devolviendo
    // aquellas que no lo son

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

  validEndDate = () => {
    // en caso de que haya un overlapped schedule, la fecha de fin de vigencia de este, ahora sera
    // igual a la fecha de inicio de vigencia del nuevo schedule o el que estamos modificando, por
    // lo que aca se valida si hay reservas que esten quedando afuera del periodo de vigencia de
    // este ultimo para en ese caso, comunicarselo al usuario

    const { nextReservations } = this.props;
    const newEndDate = this.props.endDate;

    if (this.state.overlappedSchedule) {
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
      reservationMinCancelTime,
      startDate,
      endDate,
      schedules
    } = this.props;
    const { reservationsToCancel } = this.state;

    if (this.validateMinimumData()) {
      const success = await this.props.onScheduleUpdate({
        commerceId,
        scheduleId,
        cards,
        reservationMinLength,
        reservationDayPeriod,
        reservationMinCancelTime,
        startDate,
        endDate,
        schedules,
        reservationsToCancel
      });

      if (success) {
        // si se guardo con exito, se recarga el listado de schedules y se vuelve
        this.props.onActiveSchedulesRead({
          commerceId,
          date: new Date()
        })

        this.props.navigation.goBack();
      }
    }
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
      reservationsToCancel: reservationsToCancel.concat(notCoveredReservations),
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

    this.setState({ incompatibleEndDateVisible: false }, this.compatibleSchedule);
  }

  onIncompatibleEndDateSave = () => {
    const { reservationsToCancel, reservationsAfterEndDate } = this.state;

    this.setState({
      reservationsToCancel: reservationsToCancel.concat(reservationsAfterEndDate),
      incompatibleEndDateVisible: false
    }, this.compatibleSchedule);
  }

  renderFirstItem = () => {
    const { reservationMinFrom, reservationMinTo, reservationMinValue } = this.state.sliderValues;

    return (
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
    );
  }

  renderRow = ({ item }) => {
    if (item.id === 'firstItem') {
      // esto es para que el primer item que tiene las fechas de vigencia y la duracion del
      // turno este en la FlatList, sino se quedaria anclada arriba y no scrollearia
      return this.renderFirstItem();
    }

    return (
      <ScheduleRegisterItem card={item} />
    );
  };

  renderList = () => {
    const { cards, refreshing, loadingReservations } = this.props;

    if (cards.length) {
      return (
        <FlatList
          data={[{ id: 'firstItem' }, ...cards]}
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
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
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
    reservationMinCancelTime,
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
    reservationMinCancelTime,
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
    onNextReservationsRead,
    onActiveSchedulesRead
  }
)(ScheduleRegister);
