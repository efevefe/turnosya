import {
    ON_COURT_RESERVATION_VALUE_CHANGE,
    ON_CLIENT_COURT_RESERVATION_CREATING,
    ON_CLIENT_COURT_RESERVATION_CREATE,
    ON_CLIENT_COURT_RESERVATION_CREATE_FAIL,
    ON_COURT_RESERVATION_STATE_CLEAR
} from "../actions/types";

const INITIAL_STATE = {
    commerce: null,
    courtType: '',
    slot: null,
    court: null,
    price: 0,
    light: false,
    loading: false,
    saved: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COURT_RESERVATION_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case ON_CLIENT_COURT_RESERVATION_CREATING:
            return { ...state, loading: true };
        case ON_CLIENT_COURT_RESERVATION_CREATE:
            return { ...state, loading: false, saved: true };
        case ON_CLIENT_COURT_RESERVATION_CREATE_FAIL:
            return { ...state, loading: false };
        case ON_COURT_RESERVATION_STATE_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
}