import { ON_VALUE_CHANGE, CREATE_SERVICE } from '../actions/types';

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
        case CREATE_SERVICE:
            return INITIAL_STATE;
        default:
            return state;
    }
};