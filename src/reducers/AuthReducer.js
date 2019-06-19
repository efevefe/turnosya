import {
  ON_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGOUT_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  loading: false,
  error: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_LOGIN:
      return { ...state, error: '', loading: true };
    case ON_LOGIN_SUCCESS:
      return INITIAL_STATE;
    case ON_LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case ON_LOGOUT:
      return { ...INITIAL_STATE, loading: true };
    case ON_LOGOUT_SUCCESS:
      return INITIAL_STATE;
    case ON_LOGOUT_FAIL:
      return INITIAL_STATE;
    default:
      return state;
  }
};
