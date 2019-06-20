import {
  ON_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGOUT_FAIL,
  ON_LOGIN_FACEBOOK,
  ON_LOGIN_GOOGLE
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  loadingLogin: false,
  loadingFacebook: false,
  loadingGoogle: false,
  disabledLogin: false,
  disabledFacebook: false,
  disabledGoogle: false,
  disabledCreateAccount: false,
  error: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_LOGIN:
      return {
        ...INITIAL_STATE,
        ...state,
        error: '',
        loadingLogin: true,
        disabledFacebook: true,
        disabledGoogle: true,
        disabledCreateAccount: true
      };
    case ON_LOGIN_FACEBOOK:
      return {
        ...INITIAL_STATE,
        loadingFacebook: true,
        disabledLogin: true,
        disabledGoogle: true,
        disabledCreateAccount: true
      };
    case ON_LOGIN_GOOGLE:
      return {
        ...INITIAL_STATE,
        loadingGoogle: true,
        disabledLogin: true,
        disabledFacebook: true,
        disabledCreateAccount: true
      }
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
