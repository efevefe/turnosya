import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  ON_REFINEMENT_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
  refinement: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REFINEMENT_UPDATE:
      return { ...state, refinement: action.payload };
    default:
      return state;
  }
};
