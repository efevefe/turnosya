import {
    ON_RESERVATION_VALUE_CHANGE,
    ON_RESERVATION_CREATING,
    ON_RESERVATION_CREATE,
    ON_RESERVATION_CREATE_FAIL,
    ON_NEW_RESERVATION,
    ON_NEW_SERVICE_RESERVATION
} from "../actions/types";

const INITIAL_STATE = {
    // RESERVATION
    clientName: '',
    clientPhone: '',
    commerce: null,
    areaId: null,
    startDate: null,
    endDate: null,
    price: 0,
    saved: false,
    loading: false,
    // COURT RESERVATION ONLY
    slot: null, // este capaz no haga falta usarlo mas
    court: null,
    courtType: '',
    light: false,
    // SERVICE RESERVATION ONLY
    service: null,
    employee: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_RESERVATION_VALUE_CHANGE:
            return { ...state, ...action.payload };
        case ON_RESERVATION_CREATING:
            return { ...state, loading: true };
        case ON_RESERVATION_CREATE:
            return { ...state, loading: false, saved: true };
        case ON_RESERVATION_CREATE_FAIL:
            return { ...state, loading: false };
        case ON_NEW_RESERVATION:
            return { ...state, saved: false, clientName: '', clientPhone: '' };
        case ON_NEW_SERVICE_RESERVATION:
            return { ...state, employee: null, service: null };
        default:
            return state;
    }
}