import {
  ON_COMMERCE_VALUE_CHANGE,
  COMMERCE_PROFILE_CREATE,
  COMMERCE_FAIL,
  ON_REGISTER_COMMERCE,
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  description: '',
  avatar: null,
  cuit: '',
  email: '',
  phone: '',
  address:'',
  city:'',
  province:'',
  sector:'',
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case COMMERCE_FAIL:
      return { ...state, error: action.payload, loading: false };
    case ON_REGISTER_COMMERCE:
      return { ...state, loading: true };
    case COMMERCE_PROFILE_CREATE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
