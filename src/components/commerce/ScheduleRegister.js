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
    reservationsModalVisible: false,
    lastReservationDate: formattedMoment(),
    prevCards: [], // este capaz no hace mas falta
    sliderValues: {
      reservationMinFrom: 10,
      reservationMinTo: 240,
      reservationMinValue: 60
    },
    startDateError: '',
    endDateError: ''
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

    this.setState({ prevCards: [...this.props.cards] });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextReservations !== this.props.nextReservations) {
      // verificar tambien si no se produjo un error al leer las reservas
      this.workShiftsValidate();
    }

    if (prevProps.startDate !== this.props.startDate) this.renderStartDateError();
    if (prevProps.endDate !== this.props.endDate) this.renderEndDateError();
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor="white" />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onSavePress = () => {
    if (!this.validateMinimumData()) {
      return Toast.show({ text: 'Hay datos faltantes o incorrectos' });
    }

    let startDate = formattedMoment();

    if (this.props.startDate > startDate) startDate = this.props.startDate;

    // esto deberia verificar tambien las fechas de vigencia y el tiempo del turno
    if (JSON.stringify(this.props.cards) !== JSON.stringify(this.state.prevCards)) {
      return this.props.onNextReservationsRead({
        commerceId: this.props.commerceId,
        startDate,
        endDate: this.props.endDate
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
    const { nextReservations, startDate } = this.props;

    if (nextReservations) {
      if (!this._compatibleSchedule()) {
        return this.setState({ reservationsModalVisible: true });
      }

      if (startDate && startDate > moment()) {
        return this.onScheduleSave(this.props.startDate);
      }

      return this.onScheduleSave(formattedMoment());
    }

    if (startDate && startDate > moment()) {
      return this.onScheduleSave(this.props.startDate);
    }

    return this.onScheduleSave(formattedMoment());
  }

  // bien
  _compatibleSchedule = () => {
    const { nextReservations, cards } = this.props;
    let notCoveredReservations = [];

    for (i in cards) {
      // nuevos horarios de atencion
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      // se verifica si los nuevos horarios abarcan las (startDate, endDate) de los turnos proximos
      notCoveredReservations = this._compatibleShift(firstShiftStart, firstShiftEnd, days, nextReservations);

      // si existen segundos horarios, se verifica lo mismo que los primeros horarios
      if (notCoveredReservations.length && secondShiftStart && secondShiftEnd) {
        notCoveredReservations = this._compatibleShift(secondShiftStart, secondShiftEnd, days, notCoveredReservations);
      }

      if (notCoveredReservations.length) {
        this.setState({ lastReservationDate: notCoveredReservations[notCoveredReservations.length - 1].startDate })
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

  onModalSavePress = () => {
    this.onScheduleSave(formattedMoment(this.state.lastReservationDate));
    this.setState({ reservationsModalVisible: false });
  }

  onScheduleSave = startDate => {
    const {
      schedules,
      commerceId,
      cards,
      reservationMinLength,
      reservationDayPeriod,
      endDate,
      navigation
    } = this.props;

    this.props.onScheduleUpdate(
      {
        schedules,
        commerceId,
        cards,
        reservationMinLength,
        reservationDayPeriod,
        startDate,
        endDate
      },
      navigation
    );

    // aca no va el goback, pero si la consulta
    // this.onBackPress();
  }

  onBackPress = () => {
    // aca deberia verificar si hay cambios no guardados y preguntar si quiere descartar

    this.props.navigation.goBack();
    // this.props.onScheduleRead({
    //   commerceId: this.props.commerceId,
    //   selectedDate: this.props.navigation.getParam('selectedDate')
    // });
  };

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

  renderStartDateError = () => {
    const { startDate, endDate } = this.props;

    if (startDate < formattedMoment()) {
      this.setState({ startDateError: 'No puede ser una fecha anterior a la actual' });
    } else if (endDate && (startDate >= endDate)) {
      this.setState({ startDateError: 'Debe ser anterior a la fecha de fin de vigencia' });
    } else if (!startDate) {
      this.setState({ startDateError: 'Debe seleccionar una fecha' });
    } else {
      this.setState({ startDateError: '' });
      return true;
    }

    return false;
  }

  renderEndDateError = () => {
    const { startDate, endDate } = this.props;

    if (endDate && (endDate < formattedMoment())) {
      this.setState({ endDateError: 'No puede ser una fecha anterior a la actual' });
    } else if (endDate && (startDate >= endDate)) {
      this.setState({ endDateError: 'Debe ser posterior a la fecha de fin de vigencia' });
    } else {
      this.setState({ endDateError: '' });
      return true;
    }

    return false;
  }

  renderRow = ({ item }) => {
    return (
      <ScheduleRegisterItem card={item} navigation={this.props.navigation} />
    );
  };

  renderUpdateScheduleModal = () => {
    const { lastReservationDate } = this.state;

    return (
      <Menu
        title={
          'Los nuevos horarios de atencion entraran en vigencia luego del ' +
          `${DAYS[lastReservationDate.day()]} ` +
          `${lastReservationDate.format('D')} de ` +
          `${MONTHS[lastReservationDate.month()]}, ` +
          'debido a que entran en conflicto con una o mas reservas existentes ' +
          'hasta esa fecha. ¿Desea confirmar los cambios?'}
        onBackdropPress={() => this.setState({ reservationsModalVisible: false })}
        isVisible={this.state.reservationsModalVisible}
      >
        <MenuItem
          title="Acepar"
          icon="md-checkmark"
          onPress={this.onModalSavePress}
        />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem
          title="Cancelar"
          icon="md-close"
          onPress={() => this.setState({ reservationsModalVisible: false })}
        />
      </Menu>
    );
  }

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
              onDateChange={date => this.props.onScheduleValueChange({
                prop: 'startDate',
                value: moment(date)
              })}
            />
            <DatePicker
              date={this.props.endDate}
              mode="date"
              label="Fin de vigencia:"
              placeholder="Sin fecha"
              errorMessage={this.state.endDateError}
              onDateChange={date => this.props.onScheduleValueChange({
                prop: 'endDate',
                value: moment(date)
              })}
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
        {this.renderUpdateScheduleModal()}

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
    schedules,
    cards,
    selectedDays,
    reservationMinLength,
    reservationDayPeriod,
    startDate,
    endDate,
    error,
    loading,
    refreshing
  } = state.commerceSchedule;
  const { nextReservations } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { commerceId } = state.commerceData;

  return {
    schedules,
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
    startDate,
    endDate,
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
