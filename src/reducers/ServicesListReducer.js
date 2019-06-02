import { SERVICES_READ } from '../actions/types';

const INITIAL_STATE = { };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SERVICES_READ:
            return action.payload;
        default:
            return state;
    }
};