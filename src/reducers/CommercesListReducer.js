import { COMMERCE_LIST_READ, COMMERCE_LIST_READING } from '../actions/types';

const INITIAL_STATE = { commerces: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COMMERCE_LIST_READING:
      return { ...state, loading: true };
    case COMMERCE_LIST_READ:
      return { commerces: action.payload, loading: false };
    default:
      return state;
  }
};
