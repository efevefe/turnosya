import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ
} from '../actions/types';

const INITIAL_STATE = {
  commerces: [],
  areas: [],
  loading: false,
  searching: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCES_LIST_READING:
      return { ...state, loading: true };
    case ON_COMMERCES_LIST_READ:
      return { ...state, commerces: action.payload, loading: false };
    case ON_AREAS_READING:
      return { ...state, loading: true };
    case ON_AREAS_SEARCH_READ:
      return { ...state, areas: action.payload, loading: false };
    case ON_COMMERCES_LIST_SEARCHING:
      return { ...state, searching: true };
    case ON_COMMERCES_LIST_SEARCHED:
      return { ...state, commerces: action.payload, searching: false };
    default:
      return state;
  }
};
