import {
  ON_LOCATION_VALUE_CHANGE,
  ON_USER_LOCATION_CHANGE,
  ON_SELECTED_LOCATION_CHANGE,
  ON_LOCATION_VALUES_RESET,
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
    longitude: null,
  },
  selectedLocation: {
    address: '',
    city: '',
    provinceName: '',
    country: '',
    latitude: null,
    longitude: null,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_LOCATION_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_USER_LOCATION_CHANGE:
      return action.payload
        ? { ...state, userLocation: { ...action.payload } }
        : { ...state, userLocation: { ...INITIAL_STATE.userLocation } };

    case ON_SELECTED_LOCATION_CHANGE:
      return action.payload
        ? { ...state, selectedLocation: { ...action.payload } }
        : { ...state, selectedLocation: { ...INITIAL_STATE.selectedLocation } };

    case ON_LOCATION_VALUES_RESET:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
};
