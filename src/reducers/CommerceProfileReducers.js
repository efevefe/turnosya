import {
  COMMERCE_FAIL,
  COMMERCE_READ,
  COMMERCE_READING,
  ON_COMMERCE_PROFILE_VALUE_CHANGE,
  COMMERCE_PROFILE_CREATE
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  description: '',
  avatar: null,
  cuit: '',
  location: '',
  email: '',
  phone: '',
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_PROFILE_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case COMMERCE_FAIL:
      return { ...state, error: action.payload, loading: false };
    case COMMERCE_READING:
      return { ...state, loading: true };
    case COMMERCE_READ:
      return { ...state, loading: false };
    default:
      return state;
  }
};
