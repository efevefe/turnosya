import {
  ON_SCHEDULE_CONFIG_UPDATING,
  ON_SCHEDULE_CONFIG_UPDATED,
  ON_SCHEDULE_CONFIG_VALUE_CHANGE
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  reservationMinLength: 15,
  reservationDayPeriod: 1
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_CONFIG_UPDATING:
      return { ...state, loading: true };
    case ON_SCHEDULE_CONFIG_UPDATED:
      return { ...state, loading: false };
    case ON_SCHEDULE_CONFIG_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    default:
      return INITIAL_STATE;
  }
};
