import {
  ON_LOGIN_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGOUT_FAIL,
  ON_LOGIN_FACEBOOK,
  ON_LOGIN_GOOGLE,
  ON_REAUTH_SUCCESS,
  ON_REAUTH_FAIL,
  ON_EMAIL_VERIFY_ASKED,
  ON_EMAIL_VERIFY_REMINDED,
  ON_PASSWORD_RESET_EMAIL_SENDING,
  ON_PASSWORD_RESET_EMAIL_SENT,
  ON_PASSWORD_RESET_EMAIL_FAIL
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  email: '',
  password: '',
  loadingLogin: false,
  loadingFacebook: false,
  loadingGoogle: false,
  sendingEmail: false,
  error: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_LOGIN_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_EMAIL_VERIFY_ASKED:
      Toast.show({ text: `El email se ha enviado a ${action.payload}` });
      return { ...state };
    case ON_EMAIL_VERIFY_REMINDED:
      Toast.show({
        text: 'Recuerda validar tu email para mayores funcionalidades!'
      });
      return state;
    case ON_LOGIN:
      return { ...state, error: '', loadingLogin: true };
    case ON_LOGIN_FACEBOOK:
      return { ...INITIAL_STATE, loadingFacebook: true };
    case ON_LOGIN_GOOGLE:
      return { ...INITIAL_STATE, loadingGoogle: true };
    case ON_LOGIN_SUCCESS:
      return INITIAL_STATE;
    case ON_LOGIN_FAIL:
      return {
        ...state,
        error: 'Usuario o contraseña incorrectos',
        loadingLogin: false,
        loadingFacebook: false,
        loadingGoogle: false
      };
    case ON_LOGOUT:
      return { ...INITIAL_STATE, loading: true };
    case ON_LOGOUT_SUCCESS:
      return INITIAL_STATE;
    case ON_LOGOUT_FAIL:
      return INITIAL_STATE;
    case ON_REAUTH_SUCCESS:
      return INITIAL_STATE;
    case ON_REAUTH_FAIL:
      return { ...state, error: 'Contraseña incorrecta' };
    case ON_PASSWORD_RESET_EMAIL_SENDING:
      return { ...state, sendingEmail: true, error: '' };
    case ON_PASSWORD_RESET_EMAIL_SENT:
      return { ...state, sendingEmail: false };
    case ON_PASSWORD_RESET_EMAIL_FAIL:
      return { ...state, sendingEmail: false, error: 'Usuario inexistente' };
    default:
      return state;
  }
};
