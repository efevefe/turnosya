import {
  ON_COURT_VALUE_CHANGE,
  ON_FORM_OPEN,
  ON_COURT_CREATE
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  courts: [],
  court: '',
  grouds: [],
  ground: '',
  price: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_FORM_OPEN:
      return INITIAL_STATE;
    case ON_COURT_CREATE:
      return INITIAL_STATE;
    default:
      return state;
  }
};
