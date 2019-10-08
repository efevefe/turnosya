import {
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_CLIENT_COURT_RESERVATION_CREATE_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READING,
  ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READ
} from '../actions/types';

INITIAL_STATE = {
  reservations: {},
  reservationsOnSlot: {},
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_COURT_RESERVATIONS_READING:
      return { ...state, loading: true };
    case ON_COMMERCE_COURT_RESERVATIONS_READ:
      return { ...state, reservations: action.payload, loading: false };
    case ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READING:
      return { ...state, loading: true };
    case ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READ:
      return { ...state, reservationsOnSlot: action.payload, loading: false };
    case ON_CLIENT_COURT_RESERVATION_CREATE_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};

