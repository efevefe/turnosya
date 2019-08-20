import {
  ON_COMMERCES_LIST_READING, ON_COMMERCES_LIST_READ, ON_COMMERCES_LIST_SEARCHING, ON_COMMERCES_LIST_SEARCHED
} from '../actions/types';

const INITIAL_STATE = { commerces: [], loading: false, searching: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCES_LIST_READING:
      return { ...state, loading: true };
    case ON_COMMERCES_LIST_READ:
      return { commerces: action.payload, loading: false };
    case ON_COMMERCES_LIST_SEARCHING:
      return { ...state, searching: true };
    case ON_COMMERCES_LIST_SEARCHED:
      return { commerces: action.payload, searching: false };
    default:
      return state;
  }
};
