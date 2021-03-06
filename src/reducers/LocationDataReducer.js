import { ON_LOCATION_VALUE_CHANGE, ON_SELECTED_LOCATION_CHANGE, ON_LOCATION_VALUES_RESET } from '../actions/types';

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
  },
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_LOCATION_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_SELECTED_LOCATION_CHANGE:
      return action.payload
        ? { ...state, selectedLocation: { ...action.payload }, loading: false }
        : { ...state, selectedLocation: { ...INITIAL_STATE.selectedLocation }, loading: false };

    case ON_LOCATION_VALUES_RESET:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
};
