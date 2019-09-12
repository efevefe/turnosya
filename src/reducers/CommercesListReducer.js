import {
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ON_COMMERCE_SEARCHING
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  searching: true,
  areas: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_AREAS_READING:
      return { ...state, loading: true };
    case ON_AREAS_SEARCH_READ:
      return { ...state, areas: action.payload, loading: false };
    case ON_COMMERCE_SEARCHING:
      return { ...state, searching: action.payload };
    default:
      return state;
  }
};
