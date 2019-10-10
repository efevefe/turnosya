import { COURT_READ, COURT_READING, COURT_READ_FAIL } from '../actions/types';

const INITIAL_STATE = { courts: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COURT_READING:
      return { ...state, loading: true };
    case COURT_READ:
      return { courts: action.payload, loading: false };
    case COURT_READ_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
