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
  ON_AREAS_READ,
  ON_COMMERCE_OPEN,
  ON_COMMERCE_CREATING,
  CUIT_EXISTS,
  CUIT_NOT_EXISTS,
  ON_COMMERCE_DELETING,
  ON_COMMERCE_DELETED,
  ON_COMMERCE_DELETE_FAIL,
  ON_REAUTH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  description: '',
  cuit: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: { provinceId: '', name: '' },
  provincesList: [{ value: '', label: '' }],
  area: { areaId: '', name: '' },
  areasList: [{ value: '', label: '' }],
  profilePicture: '',
  commerceId: null,
  error: '',
  loading: false,
  refreshing: false,
  cuitExists: false,
  confirmDeleteVisible: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_OPEN:
      return { ...state, commerceId: action.payload };
    case ON_COMMERCE_CREATING:
      return { ...INITIAL_STATE };
    case ON_COMMERCE_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case COMMERCE_FAIL:
      return { ...state, error: action.payload, loading: false };
    case ON_REGISTER_COMMERCE:
      return { ...state, loading: true };
    case COMMERCE_PROFILE_CREATE:
      return { ...state, loading: false };
    case ON_COMMERCE_READING:
      return { ...state, refreshing: true };
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
    case CUIT_EXISTS:
      return { ...state, cuitExists: true };
    case CUIT_NOT_EXISTS:
      return { ...state, cuitExists: false };
    case ON_COMMERCE_DELETING:
      return { ...state, loading: true };
    case ON_REAUTH_SUCCESS:
      return { ...state, confirmDeleteVisible: false };
    case ON_COMMERCE_DELETED:
      return INITIAL_STATE;
    case ON_COMMERCE_DELETE_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
