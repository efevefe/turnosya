import { ON_COURT_RESERVATION_VALUE_CHANGE } from "../actions/types";

const INITIAL_STATE = {
    commerce: null,
    courtType: '',
    slot: null,
    court: null,
    price: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COURT_RESERVATION_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        default:
            return state;
    }
}