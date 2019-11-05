import {
  ON_LOCATION_VALUE_CHANGE,
  ON_LOCATION_CHANGE,
  ON_USER_LOCATION_CHANGE,
  ON_LOCATION_VALUES_RESET,
  ON_SPECIFIC_LOCATION_ENABLED
} from '../actions/types';

const INITIAL_STATE = {
  specificLocationEnabled: null,
  address: '',
  city: '',
  provinceName: '',
  country: '',
  latitude: null,
  longitude: null,
  userLocation: {
    address: '',
    city: '',
    provinceName: '',
    country: '',
    latitude: null,
    longitude: null
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_LOCATION_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_LOCATION_CHANGE:
      if (state.specificLocationEnabled === null) {
        return { ...state, ...action.payload };
      }

      return state.specificLocationEnabled
        ? { ...state, ...action.payload }
        : state;
    case ON_USER_LOCATION_CHANGE:
      return state.specificLocationEnabled
        ? {
            ...state,
            userLocation: { ...action.payload }
          }
        : {
            specificLocationEnabled: state.specificLocationEnabled,
            ...action.payload,
            userLocation: { ...action.payload }
          };
    case ON_LOCATION_VALUES_RESET:
      return { ...INITIAL_STATE };
    case ON_SPECIFIC_LOCATION_ENABLED:
      return { ...state, specificLocationEnabled: action.payload };
    default:
      return state;
  }
};
