import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../../constants';

//const height = Math.round((Dimensions.get('window').width / Dimensions.get('window').height) * 230);

class Calendar extends Component {
  render() {
    return (
      <CalendarStrip
        {...this.props}
        calendarAnimation={{ type: 'sequence', duration: 60 }}
        daySelectionAnimation={{
          type: 'background',
          duration: 60,
          highlightColor: 'white'
        }}
        calendarColor={MAIN_COLOR}
        style={{ height: 115, paddingTop: 10, paddingBottom: 10 }} //main container
        calendarHeaderContainerStyle={{ paddingBottom: 10 }} // mes y año container
        calendarHeaderStyle={{ color: 'white' }} // mes y año text
        dateNameStyle={{ color: 'white' }}
        dateNumberStyle={{ color: 'white' }}
        highlightDateNameStyle={{ color: MAIN_COLOR }}
        highlightDateNumberStyle={{ color: MAIN_COLOR }}
        disabledDateNameStyle={{ color: MAIN_COLOR_DISABLED }}
        disabledDateNumberStyle={{ color: MAIN_COLOR_DISABLED }}
        maxDayComponentSize={60}
        iconContainer={{ flex: 0.1 }}
        leftSelector={
          <Ionicons name="ios-arrow-back" color="white" size={25} />
        }
        rightSelector={
          <Ionicons name="ios-arrow-forward" color="white" size={25} />
        }
      />
    );
  }
}

export { Calendar };
