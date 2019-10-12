import moment from 'moment';
import {
    ON_COMMERCE_COURT_RESERVATIONS_READING,
    ON_COMMERCE_COURT_RESERVATIONS_READ,
    ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
    ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
    ON_RESERVATION_CLIENT_READ_FAIL,
    ON_RESERVATION_CLIENT_READING,
    ON_RESERVATION_CLIENT_READ
} from '../actions/types';

INITIAL_STATE = {
    reservations: [],
    reservationsDetailed: [],
    reservationClient: {},
    selectedDate: moment(),
    loading: false,
    loadingClientData: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
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
        default:
            return state;
    }
};

