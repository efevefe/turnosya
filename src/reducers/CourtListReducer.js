import { COURT_READ, COURT_READING } from '../actions/types';

const INITIAL_STATE = { courts: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COURT_READING:
      return { ...state, loading: true };

    case COURT_READ:
      return { ...state, courts: action.payload, loading: false };

    default:
      return state;
  }
};
