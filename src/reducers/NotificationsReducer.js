import {
  ON_NOTIFICATION_TOKENS_READ,
  ON_NOTIFICATION_TOKENS_READ_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  tokens: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_NOTIFICATION_TOKENS_READ:
      return { ...state, tokens: action.payload };
      case ON_NOTIFICATION_TOKENS_READ_FAIL:
      return { ...state}
    default:
      return state;
  }
};
