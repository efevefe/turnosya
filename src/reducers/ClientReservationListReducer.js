import { CLIENT_RERSERVATION_READ, CLIENT_RERSERVATION_READING, CLIENT_RERSERVATION_FAIL } from "../actions/types";
import { Toast } from '../components/common';


const INITIAL_STATE = {
    reservations: [],
    loading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLIENT_RERSERVATION_READ:
            return { loading: false, reservations: action.payload }
        case CLIENT_RERSERVATION_READING:
            return { ...state, loading: true }
        case CLIENT_RERSERVATION_FAIL:
            Toast.show(action.payload)
            return { INITIAL_STATE, loading: false }
        default:
            return state;
    }
}