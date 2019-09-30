import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Schedule } from './common';
import {
    onScheduleRead,
    onScheduleValueChange,
    onCourtReservationValueChange
} from '../actions';

class ClientCommerceSchedule extends Component {
    componentDidMount() {
        this.props.onScheduleValueChange({ prop: 'selectedDate', value: moment() });
        this.props.onScheduleRead(this.props.commerce.objectID);
    }

    onSlotPress = slot => {
        this.props.onCourtReservationValueChange({
            prop: 'slot',
            value: slot
        });

        this.props.navigation.navigate('commerceCourtsList');
    }

    render() {
        const {
            cards,
            selectedDate,
            reservationDayPeriod,
            reservationMinLength,
            loading,
            onScheduleRead,
            onScheduleValueChange
        } = this.props;

        return (
            <Schedule
                cards={cards}
                selectedDate={selectedDate}
                reservationDayPeriod={reservationDayPeriod}
                reservationMinLength={reservationMinLength}
                loading={loading}
                onDateChanged={date => onScheduleValueChange({ prop: 'selectedDate', value: date })}
                onRefresh={() => onScheduleRead(this.props.commerce.objectID)}
                onSlotPress={slot => this.onSlotPress(slot)}
            />
        );
    }
}

const mapStateToProps = state => {
    const {
        cards,
        selectedDate,
        reservationDayPeriod,
        reservationMinLength,
        loading,
        refreshing
    } = state.scheduleRegister;
    const { commerce } = state.courtReservation;

    return {
        commerce,
        cards,
        selectedDate,
        reservationDayPeriod,
        reservationMinLength,
        loading,
        refreshing
    };
};

export default connect(
    mapStateToProps,
    {
        onScheduleValueChange,
        onScheduleRead,
        onCourtReservationValueChange
    }
)(ClientCommerceSchedule);