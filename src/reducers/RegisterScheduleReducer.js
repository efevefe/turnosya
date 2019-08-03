import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT
} from '../actions/types';

const INITIAL_STATE = {
  mondayTimeOpen: '',
  mondayTimeClose: '',
  thuesdayTimeOpen: '',
  thuesdayTimeClose: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_FORM_OPEN:
      return INITIAL_STATE;
    case ON_SCHEDULE_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case SCHEDULE_FORM_SUBMIT:
      return { ...state, loading: true };
    default:
      return state;
  }
};
