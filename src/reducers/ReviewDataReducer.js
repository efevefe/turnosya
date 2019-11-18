import { ON_REVIEW_VALUE_CHANGE } from '../actions/types';

const INITIAL_STATE = {
  rating: 3,
  comment: '',
  date: '',
  clientId: '',
  commerceId: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REVIEW_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    default:
      return state;
  }
};
