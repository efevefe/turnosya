import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment';
import { Calendar } from './common';

let datesWhitelist = [
    {
        start: moment(),
        end: moment().add(10, 'days'), // total 10 days enabled
    },
];

let datesBlacklist = [moment().add(4, 'days')]; // 1 day disabled

class CommerceSchedule extends Component {
    state = {
        selectedDate: moment(),
        slots: [],
        shiftStartHour: 9,
        shiftStartMinutes: 0,
        shiftEndHour: 13,
        shiftEndMinutes: 0,
        slotSize: 30
    };

    componentDidMount() {
        var slots = [];
        var shiftStart = moment.utc([2019, 7, 2, this.state.shiftStartHour, this.state.shiftStartMinutes]);
        var shiftEnd = moment.utc([2019, 7, 2, this.state.shiftEndHour, this.state.shiftEndMinutes]);
        var slotStart = moment.utc(shiftStart);

        for (var i = 0; shiftStart.add(this.state.slotSize, 'minutes') <= shiftEnd; i++) {
            slots.push({ id: i, startHour: moment.utc(slotStart), available: true });
            slotStart.add(this.state.slotSize, 'minutes');
        }

        this.setState({ slots: slots })
    }

    renderList({ item }) {
        return (
            <ListItem
                leftIcon={{ name: 'md-time', type: 'ionicon', color: item.available ? 'black' : 'grey' }}
                rightIcon={item.available ? { name: 'ios-arrow-forward', type: 'ionicon', color: 'black' } : null}
                title={`${item.startHour.format('hh:mm')}`}
                containerStyle={{ backgroundColor: item.available ? 'white' : '#E7E7E7' }}
                titleStyle={{ color: item.available ? 'black' : 'grey' }}
                rightSubtitleStyle={{ color: 'grey' }}
                rightSubtitle={item.available ? null : 'Ocupado'}
                bottomDivider
            />
        );
    }

    render() {
        return (
            <View style={{ alignSelf: 'stretch', flex: 1 }}>
                <Calendar
                    onDateSelected={date => this.setState({ selectedDate: date })}
                    datesWhitelist={datesWhitelist}
                    datesBlacklist={datesBlacklist}
                />
                <FlatList data={this.state.slots} renderItem={this.renderList.bind(this)} keyExtractor={slot => slot.id.toString()} />
            </View>
        );
    }
}

export default CommerceSchedule;