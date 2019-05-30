import { ON_VALUE_CHANGE, SERVICE_CREATE } from '../actions/types';

const INITIAL_STATE = {
    name: '',
    duration: '',
    price: '',
    description: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_VALUE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case SERVICE_CREATE:
            return INITIAL_STATE;
        default:
            return state;
    }
};