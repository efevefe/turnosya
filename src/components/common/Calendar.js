import React, { Component } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../../constants';

class Calendar extends Component {
    render() {
        return (
            <CalendarStrip
                {...this.props}
                calendarAnimation={{ type: 'sequence', duration: 60 }}
                daySelectionAnimation={{
                    type: 'background',
                    duration: 200,
                    highlightColor: 'white'
                }}
                calendarColor={MAIN_COLOR}
                style={{ height: 115, paddingTop: 10, paddingBottom: 10 }} //main container
                calendarHeaderStyle={{ color: 'white' }} //no se bien
                calendarHeaderContainerStyle={{ paddingBottom: 10 }} //mes y año
                dateNameStyle={{ color: 'white' }}
                dateNumberStyle={{ color: 'white' }}
                highlightDateNumberStyle={{ color: MAIN_COLOR }}
                highlightDateNameStyle={{ color: MAIN_COLOR }}
                disabledDateNameStyle={{ color: MAIN_COLOR_DISABLED }}
                disabledDateNumberStyle={{ color: MAIN_COLOR_DISABLED }}
                iconContainer={{ flex: 0.1 }}
                leftSelector={<Ionicons name='ios-arrow-back' color='white' size={25} />}
                rightSelector={<Ionicons name='ios-arrow-forward' color='white' size={25} />}
            />
        );
    }
}

export { Calendar };