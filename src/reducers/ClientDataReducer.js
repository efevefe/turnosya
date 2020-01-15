import {
  ON_CLIENT_DATA_VALUE_CHANGE,
  ON_USER_REGISTER,
  ON_REGISTER_FORM_OPEN,
  ON_USER_REGISTER_SUCCESS,
  ON_USER_REGISTER_FAIL,
  ON_USER_READING,
  ON_USER_READ,
  ON_USER_UPDATING,
  ON_USER_UPDATED,
  ON_USER_UPDATE_FAIL,
  ON_USER_READ_FAIL,
  ON_USER_DELETING,
  ON_USER_DELETED,
  ON_USER_DELETE_FAIL,
  ON_REAUTH_SUCCESS,
  ON_WORKPLACES_READ,
  ON_USER_PASSWORD_UPDATE
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  clientId: '',
  email: '',
  password: '',
  confirmPassword: '',
  profilePicture: '',
  firstName: '',
  lastName: '',
  phone: '',
  commerceId: null,
  rating: { total: 0, count: 0 },
  loading: false,
  refreshing: false,
  error: '',
  confirmDeleteVisible: false,
  workplaces: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_CLIENT_DATA_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_USER_REGISTER:
      return { ...state, loading: true, error: '' };
    case ON_REGISTER_FORM_OPEN:
      return { ...INITIAL_STATE };
    case ON_USER_REGISTER_SUCCESS:
      return { ...state, password: '', confirmPassword: '', loading: false };
    case ON_USER_REGISTER_FAIL:
      return { ...state, loading: false, error: 'Usuario existente' };
    case ON_USER_READING:
      return { ...state, refreshing: true };
    case ON_USER_READ:
      return { ...INITIAL_STATE, ...action.payload };
    case ON_USER_READ_FAIL:
      return { ...INITIAL_STATE };
    case ON_USER_UPDATING:
      return { ...state, refreshing: true };
    case ON_USER_UPDATED:
      Toast.show({ text: 'Cambios guardados' });
      return { ...state, profilePicture: action.payload, refreshing: false };
    case ON_USER_PASSWORD_UPDATE:
      Toast.show({ text: 'Cambios guardados' });
      return {
        ...state,
        password: '',
        confirmPassword: '',
        refreshing: false
      };
    case ON_USER_UPDATE_FAIL:
      Toast.show({ text: 'Se ha producido un error' });
      return { ...state, refreshing: false };
    case ON_USER_DELETING:
      return { ...state, loading: true };
    case ON_REAUTH_SUCCESS:
      return { ...state, confirmDeleteVisible: false };
    case ON_USER_DELETED:
      Toast.show({ text: 'Su cuenta se ha eliminado' });
      return INITIAL_STATE;
    case ON_USER_DELETE_FAIL:
      return { ...state, loading: false };
    case ON_WORKPLACES_READ:
      return { ...state, workplaces: action.payload };
    default:
      return state;
  }
};
