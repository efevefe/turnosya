import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, View, RefreshControl } from 'react-native';
import { Divider } from 'react-native-elements';
import { Fab } from 'native-base';
import { HeaderBackButton } from 'react-navigation-stack';
import moment from 'moment';
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
    if (JSON.stringify(this.props.cards) !== JSON.stringify(this.state.prevCards)) {
      return this.props.onNextReservationsDatesRead({
        commerceId: this.props.commerceId,
        startDate: formattedMoment()
      });
    }

    this.props.navigation.goBack();
  }

  workShiftsValidate = () => {
    const { nextReservationsDates } = this.props;

    if (nextReservationsDates) {
      if (!this._compatibleSchedule()) {
        return this.setState({
          reservationsModalVisible: true,
          lastReservationDate: nextReservationsDates[nextReservationsDates.length - 1]
        });
      }
    }

    this.onScheduleSave(formattedMoment());
  }

  _compatibleSchedule = () => {
    const { nextReservationsDates, cards } = this.props;

    for (i in cards) {
      // nuevos horarios de atencion
      const { firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = cards[i];

      // se verifica si los nuevos horarios abarcan las (startDate, endDate) de los turnos proximos
      let cont = this._compatibleShift(firstShiftStart, firstShiftEnd, days);

      // si existen segundos horarios, se verifica lo mismo que los primeros horarios
      if (!(cont % 2) && secondShiftStart && secondShiftEnd) {
        cont += this._compatibleShift(secondShiftStart, secondShiftEnd, days);
      }

      if (cont < nextReservationsDates.length) return false;
    }

    return true;
  }

  _compatibleShift = (shiftStart, shiftEnd, days) => {
    const { nextReservationsDates, reservationMinLength } = this.props;

    shiftStart = hourToDate(shiftStart);
    shiftEnd = hourToDate(shiftEnd);

    let cont = 0;

    while (shiftStart <= shiftEnd) {
      cont += nextReservationsDates.filter(date => {
        return (date.format('HH:mm') === shiftStart.format('HH:mm') && days.includes(date.day()))
      }).length;

      shiftStart.add(reservationMinLength, 'minutes');
    }

    return cont;
  }

  onModalSavePress = () => {
    this.onScheduleSave(formattedMoment(this.state.lastReservationDate));
    this.setState({ reservationsModalVisible: false });
  }

  onScheduleSave = startDate => {
    const {
      commerceId,
      cards,
      reservationMinLength,
      reservationDayPeriod,
      navigation
    } = this.props;

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

    this.onBackPress();
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
    const { lastReservationDate } = this.state;

    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}

        <Menu
          title={
            'La ultima reserva que tienes es el ' +
            `${DAYS[lastReservationDate.day()]} ` +
            `${lastReservationDate.format('D')} de ` +
            `${MONTHS[lastReservationDate.month()]}, ` +
            'por lo que los nuevos horarios de atencion entraran en vigencia luego ' +
            'de esa fecha debido a que entran en conflictos con reservas existentes. ' +
            '¿Desea confirmar los cambios?'}
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
    error,
    loading,
    refreshing
  } = state.commerceSchedule;
  const { nextReservationsDates } = state.courtReservationsList;
  const loadingReservations = state.courtReservationsList.loading;
  const { commerceId } = state.commerceData;

  return {
    cards,
    selectedDays,
    commerceId,
    reservationMinLength,
    reservationDayPeriod,
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
