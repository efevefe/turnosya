import { ON_LOCATION_VALUE_CHANGE, ON_LOCATION_CHANGE } from './types';

export const onLocationValueChange = ({ prop, value }) => {
  return { type: ON_LOCATION_VALUE_CHANGE, payload: { prop, value } };
};

export const onLocationChange = ({ location }) => {
  return { type: ON_LOCATION_CHANGE, payload: { location } };
};
