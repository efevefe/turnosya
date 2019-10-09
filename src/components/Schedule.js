import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Calendar } from './common/Calendar';
import { Spinner } from './common/Spinner';
import { EmptyList } from './common/EmptyList';
import { getHourAndMinutes } from '../utils';
import { MAIN_COLOR, WARNING_COLOR, SUCCESS_COLOR } from '../constants';
import { onScheduleValueChange } from '../actions';

/*
    props: {
        cards: objects array,
        selectedDate: date,
        onDateChanged: function,
        reservationMinLength: int,
        reservationDayPeriod: int,'
        loading: bool,
        onRefresh: function
        onSlotPress: return slot pressed,
    }

    slot: {
      id: identificador unico,
      startDate: fecha y hora de inicio del turno,
      endDate: fecha y hora de fin del turno,
      available: indica si tiene turnos libres o no,
      disabled: indica si esta deshabilitado o no el slot,
      free: cantidad de turnos libres en el slot,
      total: total de turnos disponibles para reservar
    }
*/

class Schedule extends Component {
  componentDidUpdate(prevProps) {
    if (
      prevProps.cards !== this.props.cards ||
      (prevProps.loadingSchedule && !this.props.loadingSchedule)
    ) {
      this.onDateSelected(this.props.selectedDate);
    }
  }

  onDateSelected = selectedDate => {
    selectedDate = moment([
      selectedDate.year(),
      selectedDate.month(),
      selectedDate.date(),
      0,
      0
    ]);

    // dia de la semana (0-6)
    var dayId = selectedDate.day();

    //slots & shifts
    var slots = [];
    const { cards } = this.props;
    var dayShifts = cards.find(card => card.days.includes(dayId)); // horario de atencion ese dia de la semana

    //si hay horario de atencion ese dia, genera los slots
    if (dayShifts) {
      var {
        firstShiftStart,
        firstShiftEnd,
        secondShiftStart,
        secondShiftEnd
      } = dayShifts;

      slots = this.generateSlots(
        selectedDate,
        firstShiftStart,
        firstShiftEnd,
        slots
      );

      if (secondShiftStart && secondShiftEnd) {
        slots = this.generateSlots(
          selectedDate,
          secondShiftStart,
          secondShiftEnd,
          slots
        );
      }
    }

    this.props.onScheduleValueChange({ prop: 'slots', value: slots });
    this.props.onDateChanged(selectedDate);
  };

  generateSlots = (selectedDate, shiftStart, shiftEnd, slots) => {
    //selected date params
    var year = selectedDate.year();
    var month = selectedDate.month();
    var date = selectedDate.date(); // dia del mes

    var slotId = slots.length;
    shiftStart = getHourAndMinutes(shiftStart);
    shiftEnd = getHourAndMinutes(shiftEnd);
    const { reservationMinLength } = this.props;

    var shiftStartDate = moment([
      year,
      month,
      date,
      shiftStart.hour,
      shiftStart.minutes
    ]);
    var shiftEndDate = moment([
      year,
      month,
      date,
      shiftEnd.hour,
      shiftEnd.minutes
    ]);
    var slotStartDate = moment(shiftStartDate);

    for (
      var j = 0;
      shiftStartDate.add(reservationMinLength, 'minutes') <= shiftEndDate;
      j++
    ) {
      slots.push({
        id: slotId,
        startDate: moment(slotStartDate),
        endDate: moment(shiftStartDate),
        available: true,
        disabled: false,
        free: 0,
        total: 0
      });
      slotStartDate.add(reservationMinLength, 'minutes');
      slotId++;
    }

    return slots;
  };

  badgeColor = (free, total) => {
    if (free == 0) {
      return MAIN_COLOR;
    } else if (free <= (total / 2)) {
      return WARNING_COLOR;
    } else {
      return SUCCESS_COLOR;
    }
  }

  renderList = ({ item }) => {
    return (
      <ListItem
        leftIcon={{
          name: 'md-time',
          type: 'ionicon',
          color: 'black'
        }}
        rightElement={
          <Badge
            value={`Disponibles: ${item.free.toString()} / ${item.total.toString()}`}
            badgeStyle={{
              height: 25,
              width: 'auto',
              borderRadius: 12.5,
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: this.badgeColor(item.free, item.total)
            }}
          />
        }
        title={`${item.startDate.format('HH:mm')}`}
        containerStyle={{
          backgroundColor: 'white'
        }}
        rightSubtitleStyle={{ color: 'grey' }}
        onPress={() => this.props.onSlotPress(item)}
        disabled={item.disabled}
        bottomDivider
      />
    );
  };

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.loading}
        onRefresh={() => this.props.onRefresh()}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  renderSlots = () => {
    if (this.props.slots.length) {
      return (
        <FlatList
          data={this.props.slots}
          renderItem={this.renderList.bind(this)}
          keyExtractor={slot => slot.id.toString()}
          refreshControl={this.onRefresh()}
        />
      );
    } else {
      return (
        <EmptyList
          title="No se encontraron turnos para este día"
          refreshControl={this.onRefresh()}
        />
      );
    }
  };

  render() {
    return (
      <View style={{ alignSelf: 'stretch', flex: 1 }}>
        <Calendar
          onDateSelected={date => this.onDateSelected(date)}
          startingDate={this.props.selectedDate}
          maxDate={moment().add(this.props.reservationDayPeriod, 'days')}
          datesWhitelist={this.props.datesWhitelist}
        />

        {this.props.loading ? (
          <Spinner style={{ position: 'relative' }} />
        ) : (
            this.renderSlots()
          )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { slots, loading } = state.scheduleRegister;

  return { slots, loadingSchedule: loading };
}

export default connect(mapStateToProps, { onScheduleValueChange })(Schedule);
