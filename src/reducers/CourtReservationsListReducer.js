import moment from 'moment';
import {
    ON_COMMERCE_COURT_RESERVATIONS_READING,
    ON_COMMERCE_COURT_RESERVATIONS_READ,
    ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
    ON_RESERVATION_CLIENT_READ_FAIL,
    ON_RESERVATION_CLIENT_READING,
    ON_RESERVATION_CLIENT_READ,
    ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
    ON_COMMERCE_LAST_COURT_RESERVATION_READ,
    ON_COMMERCE_LAST_COURT_RESERVATION_READ_FAIL
} from '../actions/types';

INITIAL_STATE = {
    reservations: [],
    detailedReservations: [],
    reservationClient: {},
    loading: false,
    loadingClientData: false,
    lastReservationDate: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value }
        case ON_COMMERCE_COURT_RESERVATIONS_READING:
            return { ...state, loading: true };
        case ON_COMMERCE_COURT_RESERVATIONS_READ:
            return { ...state, ...action.payload, loading: false };
        case ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL:
            return { ...state, loading: false };
        case ON_RESERVATION_CLIENT_READING:
            return { ...state, loadingClientData: true };
        case ON_RESERVATION_CLIENT_READ:
            return { ...state, loadingClientData: false, reservationClient: action.payload };
        case ON_RESERVATION_CLIENT_READ_FAIL:
            return { ...state, loadingClientData: false };
        case ON_COMMERCE_LAST_COURT_RESERVATION_READ:
            return { ...state, lastReservationDate: action.payload };
        case ON_COMMERCE_LAST_COURT_RESERVATION_READ_FAIL:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

