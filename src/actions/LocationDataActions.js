import {
  ON_LOCATION_VALUE_CHANGE,
  ON_LOCATION_CHANGE,
  ON_USER_LOCATION_CHANGE,
  ON_LOCATION_VALUES_RESET
} from './types';

export const onLocationValueChange = ({ prop, value }) => {
  return { type: ON_LOCATION_VALUE_CHANGE, payload: { prop, value } };
};

export const onLocationChange = location => {
  return { type: ON_LOCATION_CHANGE, payload: location };
};

export const onUserLocationChange = ({ location }) => {
  return { type: ON_USER_LOCATION_CHANGE, payload: location };
};

export const onLocationValuesReset = () => {
  return { type: ON_LOCATION_VALUES_RESET };
};
