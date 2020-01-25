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
  ON_COMMERCE_MP_TOKEN_READ,
  ON_COMMERCE_MP_TOKEN_READING,
  ON_COMMERCE_MP_TOKEN_READ_FAIL,
  ON_COMMERCE_MP_TOKEN_SWITCHED,
  ON_COMMERCE_MP_TOKEN_SWITCHING,
  ON_COMMERCE_MP_TOKEN_SWITCH_FAIL,
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
  longitude: null,
  mPagoToken: null,
  hasAnyMPagoToken: false, // Para verificar si el commercio lo debe rehabilitar u obtener uno desde cero
  mPagoTokenReadLoading: false,
  mPagoTokenSwitchLoading: false
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
      Toast.show({ text: 'Cambios guardados' });
      return { ...state, ...action.payload, refreshing: false };
    case ON_COMMERCE_UPDATE_FAIL:
      Toast.show({ text: 'Se ha producido un error' });
      return { ...state, refreshing: false };
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
      Toast.show({ text: 'Su negocio se ha eliminado' });
      return INITIAL_STATE;
    case ON_COMMERCE_DELETE_FAIL:
      return { ...state, loading: false };
    case ON_COMMERCE_MP_TOKEN_READING:
      return { ...state, mPagoTokenReadLoading: true };
    case ON_COMMERCE_MP_TOKEN_READ:
      return { ...state, ...action.payload, mPagoTokenReadLoading: false };
    case ON_COMMERCE_MP_TOKEN_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error' });
      return { ...state, mPagoTokenReadLoading: false };
    case ON_COMMERCE_MP_TOKEN_SWITCHING:
      return { ...state, mPagoTokenSwitchLoading: true };
    case ON_COMMERCE_MP_TOKEN_SWITCHED:
      return { ...state, mPagoTokenSwitchLoading: false, mPagoToken: action.payload };
    case ON_COMMERCE_MP_TOKEN_SWITCH_FAIL:
      Toast.show({ text: 'Se ha producido un error' });
      return { ...state, mPagoTokenSwitchLoading: false };
    default:
      return state;
  }
};
