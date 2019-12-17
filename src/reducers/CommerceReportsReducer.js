import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE
} from '../actions/types';

const INITIAL_STATE = {
  data: [0],
  date: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_REPORT_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_REPORT_READING:
      return { ...state, loading: true };
    case ON_COMMERCE_REPORT_READ:
      return { ...state, data: action.payload, loading: false };
    default:
      return state;
  }
};
