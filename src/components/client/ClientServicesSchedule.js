import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Schedule from '../Schedule';
import { Toast } from '../common';
import {
    onScheduleRead,
    onScheduleValueChange,
    onReservationValueChange,
    onCommerceEmployeeReservationsRead,
    onNewReservation
} from '../../actions';

class ClientServicesSchedule extends Component {
    state = { selectedDate: moment() };

    componentDidMount() {
        this.props.onScheduleRead({
            commerceId: this.props.commerce.objectID,
            selectedDate: this.state.selectedDate,
            employeeId: this.props.employee.id
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reservations !== this.props.reservations) {
            this.reservationsOnSlots();
        }
    }

    componentWillUnmount() {
        this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
    }

    onDateChanged = date => {
        const { scheduleStartDate, scheduleEndDate, scheduleId } = this.props;

        this.unsubscribeReservationsRead && this.unsubscribeReservationsRead();
        this.unsubscribeReservationsRead = this.props.onCommerceEmployeeReservationsRead({
            commerceId: this.props.commerce.objectID,
            selectedDate: date,
            employeeId: this.props.employee.id
        });

        if (!scheduleId || ((scheduleEndDate && date >= scheduleEndDate) || date < scheduleStartDate)) {
            this.props.onScheduleRead({
                commerceId: this.props.commerce.objectID,
                selectedDate: date,
                employeeId: this.props.employee.id
            });
        }

        this.setState({ selectedDate: date });
    }

    enoughTime = res => {
        const shiftsIds = new Set();

        const notAvailableSlot = this.props.slots.some(slot => {
            if (this.isResFillingSlot(slot, res)) {
                shiftsIds.add(slot.shiftsIds);
                return !slot.available;
            }

            return false;
        });

        const endSlot = this.props.slots.some(slot =>
            slot.startDate.toString() < res.endDate.toString() && slot.endDate.toString() >= res.endDate.toString()
        );

        // endSlot: para verificar que existe un slot que cubre la hora de finalizacion del turno
        // !notAvailableSlot: no tiene que haber slots ocupados entre los slots que ocupa el servicio
        // (shiftsIds.size === 1): todos los slots deben pertenecer al mismo turno (primero o segundo)
        return endSlot && !notAvailableSlot && shiftsIds.size === 1;
    }

    onSlotPress = slot => {
        if (moment() >= slot.startDate) {
            return Toast.show({
                text: 'Ya no se puede reservar en este horario'
            });
        }

        if (!slot.available) {
            return Toast.show({
                text: 'Este turno ya ha sido ocupado'
            });
        }

        const res = {
            startDate: moment(slot.startDate),
            endDate: moment(slot.startDate).add(parseInt(this.props.selectedService.duration), 'minutes')
        }

        if (!this.enoughTime(res)) {
            return Toast.show({
                text: 'Tiempo insuficiente para el servicio elegido'
            });
        }

        this.props.onReservationValueChange({
            prop: 'startDate',
            value: res.startDate
        });

        this.props.onReservationValueChange({
            prop: 'endDate',
            value: res.endDate
        });

        this.props.onNewReservation();
        this.props.navigation.navigate('confirmServiceReservation');
    };

    isResFillingSlot = (slot, res) => {
        return (
            slot.startDate.toString() >= res.startDate.toString() && slot.startDate.toString() < res.endDate.toString()
        );
    }

    reservationsOnSlots = () => {
        const { reservations, slots } = this.props;

        const newSlots = slots.map(slot => {
            let available = true;
            let visible = true;

            reservations.forEach(reservation => {
                if (this.isResFillingSlot(slot, reservation)) {
                    available = false;

                    if (slot.startDate.toString() > reservation.startDate.toString()) {
                        visible = false;
                    }
                }
            });

            return {
                ...slot,
                free: available ? 1 : 0,
                total: 1,
                available,
                visible
            };
        });

        this.props.onScheduleValueChange({ prop: 'slots', value: newSlots });
    };

    render() {
        const {
            cards,
            reservationDayPeriod,
            reservationMinLength,
            loadingSchedule,
            loadingReservations,
        } = this.props;

        const { selectedDate } = this.state;

        return (
            <Schedule
                mode='services'
                cards={cards}
                selectedDate={selectedDate}
                reservationMinLength={reservationMinLength}
                reservationDayPeriod={reservationDayPeriod}
                datesWhitelist={[
                    {
                        start: moment(),
                        end: moment().add(reservationDayPeriod, 'days')
                    }
                ]}
                loading={loadingSchedule || loadingReservations}
                onDateChanged={date => this.onDateChanged(date)}
                onSlotPress={slot => this.onSlotPress(slot)}
            />
        );
    }
}

const mapStateToProps = state => {
    const {
        id,
        cards,
        slots,
        reservationDayPeriod,
        reservationMinLength,
        startDate,
        endDate,
        refreshing,
        loading: loadingSchedule
    } = state.commerceSchedule;
    const { commerce, service, employee } = state.reservation;
    const { reservations } = state.reservationsList;
    const loadingReservations = state.reservationsList.loading;
    const { services } = state.servicesList;

    return {
        scheduleId: id,
        commerce,
        cards,
        slots,
        reservationDayPeriod,
        reservationMinLength,
        scheduleStartDate: startDate,
        scheduleEndDate: endDate,
        endDate,
        refreshing,
        reservations,
        selectedService: service,
        services,
        employee,
        loadingSchedule,
        loadingReservations
    };
};

export default connect(mapStateToProps, {
    onScheduleValueChange,
    onScheduleRead,
    onReservationValueChange,
    onCommerceEmployeeReservationsRead,
    onNewReservation
})(ClientServicesSchedule);