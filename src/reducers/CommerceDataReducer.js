import {
  ON_COMMERCE_VALUE_CHANGE,
  ON_COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_CREATE_FAIL,
  ON_REGISTER_COMMERCE,
  ON_COMMERCE_READING,
  ON_COMMERCE_READ,
  ON_COMMERCE_READ_FAIL,
  ON_COMMERCE_UPDATING,
  ON_COMMERCE_UPDATED,
  ON_COMMERCE_UPDATE_FAIL,
  ON_AREAS_READ_FOR_PICKER,
  ON_COMMERCE_OPEN,
  ON_COMMERCE_CREATING,
  ON_CUIT_EXISTS,
  ON_CUIT_NOT_EXISTS,
  ON_COMMERCE_DELETING,
  ON_COMMERCE_DELETED,
  ON_COMMERCE_DELETE_FAIL,
  ON_REAUTH_SUCCESS
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  name: '',
  description: '',
  cuit: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: { provinceId: '', name: '' },
  area: { areaId: '', name: '' },
  areasList: [{ value: '', label: '' }],
  rating: { total: 0, count: 0 },
  profilePicture: '',
  headerPicture: '',
  commerceId: null,
  error: '',
  loading: false,
  refreshing: false,
  cuitExists: false,
  confirmDeleteVisible: false,
  latitude: null,
  longitude: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_OPEN:
      return { ...state, commerceId: action.payload };

    case ON_COMMERCE_DELETED:
      Toast.show({ text: 'Su negocio se ha eliminado' });
    case ON_COMMERCE_CREATING:
    case ON_COMMERCE_READ_FAIL:
    case ON_COMMERCE_READ_FAIL:
      return { ...INITIAL_STATE };

    case ON_COMMERCE_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_COMMERCE_CREATE_FAIL:
      return { ...state, error: action.payload, loading: false };

    case ON_REGISTER_COMMERCE:
    case ON_COMMERCE_DELETING:
      return { ...state, loading: true };

    case ON_COMMERCE_PROFILE_CREATE:
    case ON_COMMERCE_DELETE_FAIL:
      return { ...state, loading: false };

    case ON_COMMERCE_READING:
    case ON_COMMERCE_UPDATING:
      return { ...state, refreshing: true };

    case ON_COMMERCE_READ:
      return { ...INITIAL_STATE, ...action.payload };

    case ON_COMMERCE_UPDATED:
      Toast.show({ text: 'Cambios guardados' });
      return { ...state, ...action.payload, refreshing: false };

    case ON_COMMERCE_UPDATE_FAIL:
      Toast.show({ text: 'Se ha producido un error' });
      return { ...state, refreshing: false };

    case ON_AREAS_READ_FOR_PICKER:
      return { ...state, areasList: action.payload };

    case ON_CUIT_EXISTS:
      return { ...state, cuitExists: true };

    case ON_CUIT_NOT_EXISTS:
      return { ...state, cuitExists: false };

    case ON_REAUTH_SUCCESS:
      return { ...state, confirmDeleteVisible: false };

    default:
      return state;
  }
};
