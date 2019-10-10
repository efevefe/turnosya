import { ON_LOCATION_VALUE_CHANGE, ON_LOCATION_CHANGE } from '../actions/types';

const INITIAL_STATE = {
  street: '',
  streetNumber: '',
  city: '',
  country: '',
  latitude: -31.417378,
  longitude: -64.18384
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_LOCATION_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_LOCATION_CHANGE:
      return { ...state, ...action.payload.location };
    default:
      return state;
  }
};
