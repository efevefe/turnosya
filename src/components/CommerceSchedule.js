import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment';
import { Calendar } from './common';

let datesWhitelist = [
    {
        start: moment(),
        end: moment().add(30, 'days'),
    },
];

let datesBlacklist = [];

class CommerceSchedule extends Component {
    state = {
        selectedDate: null,
        slots: [],
        slotSize: 30,
        shifts: { // los numeros son los dias de la semana (el domingo es el 0)
            '2': [
                { shiftStartHour: 9, shiftStartMinutes: 0, shiftEndHour: 13, shiftEndMinutes: 0 },
                { shiftStartHour: 17, shiftStartMinutes: 0, shiftEndHour: 21, shiftEndMinutes: 0 }
            ],
            '3': [
                { shiftStartHour: 9, shiftStartMinutes: 0, shiftEndHour: 12, shiftEndMinutes: 0 },
                { shiftStartHour: 16, shiftStartMinutes: 0, shiftEndHour: 21, shiftEndMinutes: 0 }
            ],
            '4': [
                { shiftStartHour: 15, shiftStartMinutes: 0, shiftEndHour: 22, shiftEndMinutes: 0 }
            ],
            '5': [
                { shiftStartHour: 9, shiftStartMinutes: 0, shiftEndHour: 13, shiftEndMinutes: 0 },
                { shiftStartHour: 17, shiftStartMinutes: 0, shiftEndHour: 21, shiftEndMinutes: 0 }
            ],
            '6': [
                { shiftStartHour: 9, shiftStartMinutes: 0, shiftEndHour: 13, shiftEndMinutes: 0 },
                { shiftStartHour: 17, shiftStartMinutes: 0, shiftEndHour: 21, shiftEndMinutes: 0 }
            ]
        }
    };

    componentDidMount() {
        this.onDateSelect(moment());
    }

    onDateSelect = async (selectedDate) => {
        await this.setState({ selectedDate });

        //selected date params
        var year = selectedDate.year();
        var month = selectedDate.month();
        var date = selectedDate.date(); // dia del mes
        var dayId = selectedDate.day(); // dia de la semana (0-6)

        //slots & shifts
        var slots = [];
        var slotId = 0;
        const { slotSize, shifts } = this.state;
        const dayShift = shifts[dayId]; // horario de atencion ese dia de la semana

        //si hay horario de atencion ese dia, genera los slots
        if (dayShift) {
            for (var i = 0; i < dayShift.length; i++) {
                const { shiftStartHour, shiftStartMinutes, shiftEndHour, shiftEndMinutes } = dayShift[i];

                var shiftStart = moment.utc([year, month, date, shiftStartHour, shiftStartMinutes]); //horario inicio turno
                var shiftEnd = moment.utc([year, month, date, shiftEndHour, shiftEndMinutes]); //horario fin turno
                var slotStart = moment.utc(shiftStart); //aca se va guardando el horario de inicio de cada turno

                for (var j = 0; shiftStart.add(slotSize, 'minutes') <= shiftEnd; j++) {
                    slots.push({ id: slotId, startHour: moment.utc(slotStart), available: true });
                    slotStart.add(slotSize, 'minutes');
                    slotId++;
                }
            }
        }

        this.setState({ slots })
    }

    renderList({ item }) {
        return (
            <ListItem
                leftIcon={{ name: 'md-time', type: 'ionicon', color: item.available ? 'black' : 'grey' }}
                rightIcon={item.available ? { name: 'ios-arrow-forward', type: 'ionicon', color: 'black' } : null}
                title={`${item.startHour.format('HH:mm')}`}
                containerStyle={{ backgroundColor: item.available ? 'white' : '#E7E7E7' }}
                titleStyle={{ color: item.available ? 'black' : 'grey' }}
                rightSubtitleStyle={{ color: 'grey' }}
                rightSubtitle={item.available ? null : 'Ocupado'}
                bottomDivider
            />
        );
    }

    renderSlots = () => {
        if (this.state.slots.length) {
            return <FlatList data={this.state.slots} renderItem={this.renderList.bind(this)} keyExtractor={slot => slot.id.toString()} />;
        } else {
            return (
                <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', margin: 15 }} >No hay turnos para este dia...</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ alignSelf: 'stretch', flex: 1 }}>
                <Calendar
                    onDateSelected={date => this.onDateSelect(date)}
                    datesWhitelist={datesWhitelist}
                    datesBlacklist={datesBlacklist}
                />
                {this.renderSlots()}
            </View>
        );
    }
}

export default CommerceSchedule;