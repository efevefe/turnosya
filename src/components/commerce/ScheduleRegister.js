import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl } from 'react-native';
import { Divider } from 'react-native-elements';
import { Fab } from 'native-base';
import { HeaderBackButton } from 'react-navigation-stack';
import moment from 'moment';
import { Spinner, IconButton, EmptyList, Menu, MenuItem } from '../common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead,
  onScheduleUpdate,
  onCommerceLastCourtReservationRead
} from '../../actions';
import { MAIN_COLOR, DAYS, MONTHS } from '../../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';
import { hourToDate, formattedMoment } from '../../utils';

class ScheduleRegister extends Component {
  state = { reservationsModalVisible: false, startDate: null, prevCards: [] };

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

    this.setState({ startDate: formattedMoment() });

    for (i in this.props.cards) {
      this.setState({ prevCards: [...this.state.prevCards, this.props.cards[i]] });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lastReservationDate !== this.props.lastReservationDate && !this.props.error) {
      this.onLastReservationValidate();
    }
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor="white" />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onSavePress = () => {
    if (JSON.stringify(this.props.cards) !== JSON.stringify(this.state.prevCards)) {
      if (this._compatibleSchedule()) return this.onScheduleSave();

      return this.props.onCommerceLastCourtReservationRead(this.props.commerceId);
    }

    this.props.navigation.goBack();
  }

  _compatibleSchedule = () => {
    const { reservationMinLength } = this.props;

    for (i in this.state.prevCards) {
      const prevCard = this.state.prevCards[i];

      // primer horarios de atencion actuales
      let prevShifts = [prevCard.firstShiftStart, prevCard.firstShiftEnd];

      // agrego los segundos horarios de atencion si existen
      if (prevCard.secondShiftStart && prevCard.secondShiftEnd) {
        prevShifts = [...prevShifts, prevCard.secondShiftStart, prevCard.secondShiftEnd];
      }

      const days = this.state.prevCards[i].days;

      for (j in days) {
        const newCard = this.props.cards.find(card => card.days.includes(days[j]));

        // si saco un dia donde antes si atendia retorna false
        if (!newCard) return false;

        // nuevos horarios de atencion
        const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = newCard;

        // se verifica si los nuevos horarios siguen abarcando los horarios anteriores
        let cont = this._compatibleShift(firstShiftStart, firstShiftEnd, prevShifts, reservationMinLength);

        // si existen segundos horarios, se verifica si siguen abarcando los horarios anteriores
        if (secondShiftStart && secondShiftEnd) {
          cont += this._compatibleShift(secondShiftStart, secondShiftEnd, prevShifts, reservationMinLength);
        }

        if (cont < prevShifts.length) return false;
      }
    }

    return true;
  }

  _compatibleShift = (shiftStart, shiftEnd, prevShifts, minutesStep) => {
    shiftStart = hourToDate(shiftStart);
    shiftEnd = hourToDate(shiftEnd);

    let cont = 0;

    while (shiftStart <= shiftEnd) {
      if (prevShifts.includes(shiftStart.format('HH:mm'))) cont++;
      shiftStart.add(minutesStep, 'minutes');
    }

    /* el turno de atencion nuevo deberia cubrir los mismos horarios que el turno anterior
    o incluso podria cubrir los horarios de todos los turnos anteriores, pero no puede cubrir
    1 o 3 horarios porque eso significa que al medio quedaria un hueco sin cubrir */
    return (cont % 2) ? 0 : cont;
  }

  onLastReservationValidate = () => {
    const { lastReservationDate } = this.props;

    if (lastReservationDate) {
      // se define la fecha de fin de vigencia de la diagramacion actual al final del dia de la ultima reserva
      let startDate = moment([
        lastReservationDate.year(),
        lastReservationDate.month(),
        lastReservationDate.date(),
      ]).add(1, 'days');

      if (startDate > moment()) {
        return this.setState({ reservationsModalVisible: true, startDate });
      }
    }

    this.onScheduleSave();
  }

  onScheduleSave = () => {
    const {
      commerceId,
      cards,
      reservationMinLength,
      reservationDayPeriod,
      navigation
    } = this.props;

    const { startDate } = this.state;

    this.props.onScheduleUpdate(
      {
        commerceId,
        cards,
        reservationMinLength,
        reservationDayPeriod,
        startDate
      },
      navigation
    );

    // luego del guardado, en la navegacion se deberia volver a cargar la diagramacion
    // vigente para la fecha que estaba seleccionada en el calendario
  }

  onBackPress = () => {
    this.props.navigation.goBack();
    this.props.onScheduleRead({
      commerceId: this.props.commerceId,
      selectedDate: this.props.navigation.getParam('selectedDate')
    });
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

  renderRow = ({ item }) => {
    return (
      <ScheduleRegisterItem card={item} navigation={this.props.navigation} />
    );
  };

  renderList = () => {
    const { cards, refreshing } = this.props;

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
              refreshing={refreshing}
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
    const { lastReservationDate } = this.props;

    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <Menu
          title={
            'La ultima reserva que tienes es el ' +
            `${DAYS[moment(lastReservationDate).day()]} ` +
            `${moment(lastReservationDate).format('D')} de ` +
            `${MONTHS[moment(lastReservationDate).month()]}, ` +
            'por lo que los nuevos horarios de atencion entraran en vigencia luego ' +
            'de esa fecha para evitar conflictos con las reservas existentes. ' +
            '¿Desea confirmar los cambios?'}
          onBackdropPress={() => this.setState({ reservationsModalVisible: false })}
          isVisible={this.state.reservationsModalVisible}
        >
          <MenuItem
            title="Acepar"
            icon="md-checkmark"
            onPress={() => {
              this.setState({ reservationsModalVisible: false });
              this.onScheduleSave();
            }}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ reservationsModalVisible: false })}
          />
        </Menu>

        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={() => this.onAddPress()}
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
    cards,
    selectedDays,
    reservationMinLength,
    reservationDayPeriod,
    endDate,
    lastReservationDate,
    error,
    loading,
    refreshing
  } = state.commerceSchedule;

  const { commerceId } = state.commerceData;

  return {
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
    endDate,
    lastReservationDate,
    error,
    loading,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  { onScheduleValueChange, onScheduleCreate, onScheduleRead, onScheduleUpdate, onCommerceLastCourtReservationRead }
)(ScheduleRegister);
