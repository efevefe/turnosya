import React, { Component } from 'react';
import { Schedule } from './common';
import { connect } from 'react-redux';
import { onScheduleRead, onScheduleValueChange } from '../actions';

class ClientCommerceSchedule extends Component {
    async componentDidMount() {
        await this.setState({ commerceId: this.props.navigation.getParam('commerceId') });

        this.props.onScheduleRead(this.state.commerceId);
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
                onRefresh={() => onScheduleRead(this.state.commerceId)}
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

    return {
        cards,
        selectedDate,
        reservationDayPeriod,
        reservationMinLength,
        loading,
        refreshing
    };
};

export default connect(mapStateToProps, { onScheduleValueChange, onScheduleRead })(ClientCommerceSchedule);