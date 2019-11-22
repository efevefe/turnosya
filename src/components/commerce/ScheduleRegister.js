import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl } from 'react-native';
import { Divider } from 'react-native-elements';
import { Fab } from 'native-base';
import moment from 'moment';
import { HeaderBackButton } from 'react-navigation-stack';
import { MAIN_COLOR, DAYS, MONTHS } from '../../constants';
import ScheduleRegisterItem from './ScheduleRegisterItem';
import { hourToDate, formattedMoment } from '../../utils';
import { Spinner, IconButton, EmptyList, Menu, MenuItem } from '../common';
import {
  onScheduleValueChange,
  onScheduleCreate,
  onScheduleRead,
  onScheduleUpdate,
  onNextReservationsDatesRead
} from '../../actions';

class ScheduleRegister extends Component {
  state = {
    reservationsModalVisible: false,
    lastReservationDate: formattedMoment(),
    prevCards: []
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
    if (prevProps.nextReservationsDates !== this.props.nextReservationsDates) {
      // verificar tambien si no se produjo un error al leer las reservas
      this.workShiftsValidate();
    }
  }

  renderBackButton = () => {
    return <HeaderBackButton onPress={this.onBackPress} tintColor="white" />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  onSavePress = () => {
    let startDate = formattedMoment();

    if (this.props.startDate > startDate) startDate = this.props.startDate;

    if (JSON.stringify(this.props.cards) !== JSON.stringify(this.state.prevCards)) {
      return this.props.onNextReservationsDatesRead({
        commerceId: this.props.commerceId,
        startDate
      });
    }

    this.props.navigation.goBack();
  }

  workShiftsValidate = () => {
    const { nextReservationsDates, cards, startDate } = this.props;

    if (nextReservationsDates) {
      if (cards) {
        if (!this._compatibleSchedule()) {
          return this.setState({ reservationsModalVisible: true });
        }

        if (startDate && startDate > moment()) {
          return this.onScheduleSave(this.props.startDate);
        }

        return this.onScheduleSave(formattedMoment());
      }

      // esto todavia no hace nada
      return this.setState({
        deleteModalVisible: true,
        lastReservationDate: nextReservationsDates[nextReservationsDates.length - 1].startDate
      });
    }

    if (cards) {
      if (startDate && startDate > moment()) {
        return this.onScheduleSave(this.props.startDate);
      }

      return this.onScheduleSave(formattedMoment());
    }

    // esto todavia no hace nada
    return this.setState({ deleteModalVisible: true });
  }

  _compatibleSchedule = () => {
    const { nextReservationsDates, cards } = this.props;
    let notCoveredReservations = [];

    for (i in cards) {
      // nuevos horarios de atencion
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      // se verifica si los nuevos horarios abarcan las (startDate, endDate) de los turnos proximos
      notCoveredReservations = this._compatibleShift(firstShiftStart, firstShiftEnd, days, nextReservationsDates);

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

  _compatibleShift = (shiftStart, shiftEnd, days, notCoveredReservations) => {
    const { reservationMinLength } = this.props;

    shiftStart = hourToDate(shiftStart);
    shiftEnd = hourToDate(shiftEnd);

    notCoveredReservations = notCoveredReservations.filter(reservation => {
      const { startDate, endDate } = reservation;

      shiftStart.year(startDate.year());
      shiftStart.month(startDate.month());
      shiftStart.date(startDate.date());

      shiftEnd.year(startDate.year());
      shiftEnd.month(startDate.month());
      shiftEnd.date(startDate.date());

      if (startDate >= shiftStart && endDate <= shiftEnd) {
        const startDiff = shiftStart.diff(startDate, 'minutes');
        const reservationDuration = startDate.diff(endDate, 'minutes');

        return (
          (startDiff % reservationMinLength) ||
          (reservationDuration % reservationMinLength) ||
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
      navigation
    } = this.props;

    this.props.onScheduleUpdate(
      {
        schedules,
        commerceId,
        cards,
        reservationMinLength,
        reservationDayPeriod,
        startDate
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
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}
        {this.renderUpdateScheduleModal()}
        {/*this.renderDeleteScheduleModal()*/}

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
  const { nextReservationsDates } = state.courtReservationsList;
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
    nextReservationsDates
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleCreate,
    onScheduleRead,
    onScheduleUpdate,
    onNextReservationsDatesRead
  }
)(ScheduleRegister);
