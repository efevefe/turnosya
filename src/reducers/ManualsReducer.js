import {
  ON_MANUAL_READING,
  ON_MANUAL_READ,
  ON_MANUAL_READ_FAIL
} from '../actions/types';

const INITIAL_STATE = { manualURL: '', loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_MANUAL_READING:
      return { ...state, loading: true };
    case ON_MANUAL_READ:
      return { ...INITIAL_STATE, manualURL: action.payload };
    case ON_MANUAL_READ_FAIL:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};