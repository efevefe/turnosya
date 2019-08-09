import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment';
import { Calendar, Button } from './common';
import { getHourMinutes } from '../utils';

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
                { shiftStart: '09:00', shiftEnd: '13:00' },
                { shiftStart: '17:00', shiftEnd: '21:00' }
            ],
            '3': [
                { shiftStart: '08:00', shiftEnd: '12:00' },
                { shiftStart: '16:00', shiftEnd: '22:00' }
            ],
            '4': [
                { shiftStart: '09:00', shiftEnd: '13:00' }
            ],
            '5': [
                { shiftStart: '08:00', shiftEnd: '13:00' },
                { shiftStart: '17:00', shiftEnd: '20:00' }
            ],
            '6': [
                { shiftStart: '09:00', shiftEnd: '13:00' },
                { shiftStart: '16:00', shiftEnd: '20:00' }
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
                var { shiftStart, shiftEnd } = dayShift[i];
                shiftStart = getHourMinutes(shiftStart);
                shiftEnd = getHourMinutes(shiftEnd);

                var shiftStartDate = moment.utc([year, month, date, shiftStart.hour, shiftStart.minutes]);
                var shiftEndDate = moment.utc([year, month, date, shiftEnd.hour, shiftEnd.minutes]);
                var slotStartDate = moment.utc(shiftStart);

                for (var j = 0; shiftStartDate.add(slotSize, 'minutes') <= shiftEndDate; j++) {
                    slots.push({ id: slotId, startHour: moment.utc(slotStartDate), endHour: moment(shiftStartDate), available: true });
                    slotStartDate.add(slotSize, 'minutes');
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