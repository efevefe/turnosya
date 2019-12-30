import {
  ON_TOKEN_NOTIFICATION_READ,
  ON_TOKEN_NOTIFICATION_READ_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  ownToken:'',
  tokens: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_TOKEN_NOTIFICATION_READ:
      return { ...state, tokens: action.payload };
      case ON_TOKEN_NOTIFICATION_READ_FAIL:
      return { ...state}
    default:
      return state;
  }
};
