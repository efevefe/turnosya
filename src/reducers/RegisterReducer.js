import { ON_VALUE_CHANGE, ON_REGISTER } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  confirmPassword: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_REGISTER:
      return INITIAL_STATE;
    default:
      return INITIAL_STATE;
  }
};
