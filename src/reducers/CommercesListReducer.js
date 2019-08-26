import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  ON_REFINEMENT_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  searching: false,
  refinement: ''
};

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
    case ON_REFINEMENT_UPDATE:
      return { ...state, refinement: action.payload };
    default:
      return state;
  }
};
