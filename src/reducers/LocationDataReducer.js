import {
  ON_LOCATION_VALUE_CHANGE,
  ON_LOCATION_CHANGE,
  ON_LOCATION_VALUES_RESET
} from '../actions/types';

const INITIAL_STATE = {
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
  },
  selectedLocation: {
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
      if (!action.payload.prop) {
        return { ...state, ...action.payload.value };
      }
      if (!action.payload.value) {
        return {
          ...state,
          [action.payload.prop]: { ...INITIAL_STATE[action.payload.prop] }
        };
      }

      return { ...state, [action.payload.prop]: { ...action.payload.value } };
    case ON_LOCATION_VALUES_RESET:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
