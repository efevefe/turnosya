import {
  ON_REFINEMENT_UPDATE,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ
} from '../actions/types';

const INITIAL_STATE = {
  refinement: '',
  loading: false,
  areas: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REFINEMENT_UPDATE:
      return { ...state, refinement: action.payload };
    case ON_AREAS_READING:
      return { ...state, loading: true };
    case ON_AREAS_SEARCH_READ:
      return { ...state, areas: action.payload, loading: false };
    default:
      return state;
  }
};
