import {  } from "../actions/types";

const INITIAL_STATE = {
    commerceId: null,
    endDate: null,
    light: null,
    court: null,
    price: null,
    status:null,
    reservationDate:null,
    startDate:null,
    loading:false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_COURT_RESERVATION_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        default:
            return state;
    }
}