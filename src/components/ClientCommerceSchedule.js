import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Schedule } from './common';
import { onScheduleRead, onScheduleValueChange } from '../actions';

class ClientCommerceSchedule extends Component {
    state = { commerceId: null, courtTypeId: null };

    async componentDidMount() {
        await this.setState({
            commerceId: this.props.navigation.getParam('commerceId'),
            courtTypeId: this.props.navigation.getParam('courtTypeId')
        });
        this.props.onScheduleValueChange({ prop: 'selectedDate', value: moment() });
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
                // esto hay que ver si hacerlo con un reducer en vez de ir pasando los datos por la navegacion
                onSlotPress={slot => this.props.navigation.navigate(
                    'commerceCourtsList',
                    {
                        commerceId: this.state.commerceId,
                        courtTypeId: this.state.courtTypeId,
                        slot
                    }
                )}
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