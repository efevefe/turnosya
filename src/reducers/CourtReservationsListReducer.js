import {
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_CLIENT_COURT_RESERVATION_CREATE_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE
} from '../actions/types';

INITIAL_STATE = {
  reservations: {},
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_COURT_RESERVATIONS_READING:
      return { ...state, loading: true };
    case ON_COMMERCE_COURT_RESERVATIONS_READ:
      return { reservations: action.payload, loading: false };
    case ON_CLIENT_COURT_RESERVATION_CREATE_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
