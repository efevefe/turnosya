import {
  COURT_READ,
  COURT_READING,
  COURT_READ_FAIL,
  COURT_READING_ONLY_AVAILABLE,
  COURT_READ_ONLY_AVAILABLE
} from '../actions/types';

const INITIAL_STATE = { courts: [], courtsAvailable: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COURT_READING:
      return { ...state, loading: true };
    case COURT_READ:
      return { ...state, courts: action.payload, loading: false };
    case COURT_READING_ONLY_AVAILABLE:
      return { ...state, loading: true };
    case COURT_READ_ONLY_AVAILABLE:
      return { ...state, courtsAvailable: action.payload, loading: false };
    case COURT_READ_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
