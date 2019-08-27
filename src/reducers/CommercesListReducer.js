import { ON_REFINEMENT_UPDATE } from '../actions/types';

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
