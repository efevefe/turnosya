import {
  ON_COURT_VALUE_CHANGE,
  ON_FORM_OPEN,
  COURT_CREATE,
  COURT_FORM_SUMBIT,
  COURT_EXISTED,
  ON_COURT_FORM_OPEN
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  courts: [],
  court: '',
  grouds: [],
  ground: '',
  price: '',
  loading: false,
  existedError: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_VALUE_CHANGE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        existedError: false
      };
    case ON_COURT_FORM_OPEN:
      return INITIAL_STATE;
    case COURT_FORM_SUMBIT:
      return { ...state, loading: true, existedError: false };
    case COURT_CREATE:
      return INITIAL_STATE;
    case COURT_EXISTED:
      return { ...state, existedError: true };
    default:
      return state;
  }
};
