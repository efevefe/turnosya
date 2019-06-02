import { SERVICES_READING, SERVICES_READ } from '../actions/types';

const INITIAL_STATE = { services: [], loading: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SERVICES_READING:
            return { ...state, loading: true }
        case SERVICES_READ:
            return  { services: action.payload, loading: false };
        default:
            return state;
    }
};