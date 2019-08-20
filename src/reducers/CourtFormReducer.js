import {
  ON_COURT_VALUE_CHANGE,
  COURT_CREATE,
  COURT_FORM_SUBMIT,
  COURT_EXISTED,
  ON_COURT_FORM_OPEN,
  COURT_UPDATE,
  COURT_DELETE
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  courts: [],
  court: '',
  grounds: [],
  ground: '',
  price: '',
  lightPrice: '',
  courtState: true,
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
    case COURT_FORM_SUBMIT:
      return { ...state, loading: true, existedError: false };
    case COURT_CREATE:
      return INITIAL_STATE;
    case COURT_UPDATE:
      return INITIAL_STATE;
    case COURT_DELETE:
      return INITIAL_STATE;
    case COURT_EXISTED:
      return { ...state, loading: false, existedError: true };
    default:
      return state;
  }
};
