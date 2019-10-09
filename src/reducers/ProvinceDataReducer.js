import { ON_PROVINCES_READ } from '../actions/types';

const INITIAL_STATE = {
  provincesList: [{ value: '', label: '' }]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_PROVINCES_READ:
      return { ...state, provincesList: action.payload };
    default:
      return state;
  }
};
