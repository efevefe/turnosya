import {
  ON_COMMERCE_VALUE_CHANGE,
  COMMERCE_PROFILE_CREATE,
  COMMERCE_FAIL,
  ON_REGISTER_COMMERCE,
  ON_COMMERCE_READING,
  ON_COMMERCE_READ,
  ON_COMMERCE_READ_FAIL,
  ON_COMMERCE_UPDATING,
  ON_COMMERCE_UPDATED,
  ON_COMMERCE_UPDATE_FAIL,
  ON_PROVINCES_READ,
  ON_AREAS_READ
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  description: '',
  cuit: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: { provinceId: null, name: '' },
  provincesList: [],
  area: { areaId: null, name: '' },
  areasList: [],
  profilePicture: null,
  commerceId: null,
  error: '',
  loading: false,
  refreshing: false
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
    case ON_COMMERCE_READING:
      return { ...state, [action.payload]: true };
    case ON_COMMERCE_READ:
      return { ...INITIAL_STATE, ...action.payload };
    case ON_COMMERCE_READ_FAIL:
      return { ...INITIAL_STATE };
    case ON_COMMERCE_UPDATING:
      return { ...state, refreshing: true };
    case ON_COMMERCE_UPDATED:
      return { ...state, profilePicture: action.payload, refreshing: false };
    case ON_COMMERCE_UPDATE_FAIL:
      return { ...state, refreshing: false };
    case ON_PROVINCES_READ:
      return { ...state, provincesList: action.payload };
    case ON_AREAS_READ:
      return { ...state, areasList: action.payload };
    default:
      return state;
  }
};
