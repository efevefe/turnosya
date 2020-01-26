import {
  COMMERCE_COURT_TYPES_READING,
  COMMERCE_COURT_TYPES_READ,
  COMMERCE_COURT_TYPES_READ_FAIL,
} from '../actions/types';

const INITIAL_STATE = { courtTypesList: [], loading: false, refreshing: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COMMERCE_COURT_TYPES_READING:
      return { ...state, [action.payload]: true };

    case COMMERCE_COURT_TYPES_READ:
      return { ...INITIAL_STATE, courtTypesList: action.payload };

    case COMMERCE_COURT_TYPES_READ_FAIL:
      return { ...state, loading: false, refreshing: false };

    default:
      return state;
  }
};
