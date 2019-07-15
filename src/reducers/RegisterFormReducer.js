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
  ON_USER_READ_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  confirmPassword: '',
  profilePicture: null,
  location: null,
  loading: false,
  loadingUpdate: false,
  error: ''
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
      return { ...INITIAL_STATE, loading: true };
    case ON_USER_READ:
      return { ...INITIAL_STATE, ...action.payload };
    case ON_USER_READ_FAIL:
      return { ...INITIAL_STATE };
    case ON_USER_UPDATING:
      return { ...state, loadingUpdate: true };
    case ON_USER_UPDATED:
      return { ...state, profilePicture: action.payload, loadingUpdate: false };
    case ON_USER_UPDATE_FAIL:
      return { ...state, loadingUpdate: false };
    default:
      return INITIAL_STATE;
  }
};
