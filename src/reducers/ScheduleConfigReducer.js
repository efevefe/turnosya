import {
  ON_SCHEDULE_CONFIG_UPDATING,
  ON_SCHEDULE_CONFIG_UPDATED
} from '../actions/types';

const INITIAL_STATE = {
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_CONFIG_UPDATING:
      return { ...state, loading: true };
    case ON_SCHEDULE_CONFIG_UPDATED:
      return { ...state, loading: false };
    default:
      return INITIAL_STATE;
  }
};
