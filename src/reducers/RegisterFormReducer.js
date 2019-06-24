import { ON_REGISTER_VALUE_CHANGE, ON_REGISTER, ON_REGISTER_SUCCESS, ON_REGISTER_FAIL } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  confirmPassword: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REGISTER_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_REGISTER:
      return { ...state, loading: true };
    case ON_REGISTER_SUCCESS:
      return INITIAL_STATE;
    case ON_REGISTER_FAIL:
      return { ...state, loading: false };
    default:
      return INITIAL_STATE;
  }
};
