import {
    ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
    ON_COMMERCE_COURT_RESERVATIONS_READING,
    ON_COMMERCE_COURT_RESERVATIONS_READ
} from "../actions/types";

const INITIAL_STATE = {
    reservations: [],
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COMMERCE_COURT_RESERVATIONS_READING:
            return { ...state, loading: true };
        case ON_COMMERCE_COURT_RESERVATIONS_READ:
            return { ...INITIAL_STATE, reservations: action.payload };
        case ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL:
            return { ...state, loading: false };
        default:
            return state;
    }
}