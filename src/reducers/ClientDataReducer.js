import {
  ON_REGISTER_VALUE_CHANGE,
  ON_REGISTER,
  ON_REGISTER_SUCCESS,
  ON_REGISTER_FAIL,
  ON_USER_READING,
  ON_USER_READ,
  ON_USER_UPDATING,
  ON_USER_UPDATED,
  ON_USER_UPDATE_FAIL,
  ON_USER_READ_FAIL,
  ON_USER_DELETING,
  ON_USER_DELETED,
  ON_USER_DELETE_FAIL,
  ON_REAUTH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  confirmPassword: '',
  profilePicture: '',
  location: null,
  firstName: '',
  lastName: '',
  phone: '',
  commerceId: null,
  loading: false,
  refreshing: false,
  error: '',
  confirmDeleteVisible: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REGISTER_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_REGISTER:
      return { ...state, loading: true, error: '' };
    case ON_REGISTER_SUCCESS:
      return INITIAL_STATE;
    case ON_REGISTER_FAIL:
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
      return { ...state, profilePicture: action.payload, refreshing: false };
    case ON_USER_UPDATE_FAIL:
      return { ...state, refreshing: false };
    case ON_USER_DELETING:
      return { ...state, loading: true };
    case ON_REAUTH_SUCCESS:
      return { ...state, confirmDeleteVisible: false };
    case ON_USER_DELETED:
      return INITIAL_STATE;
    case ON_USER_DELETE_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
