import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT
} from '../actions/types';

const INITIAL_STATE = {
  mondayOpen: '',
  mondayClose: '',
  mondayOpen2: '',
  mondayClose2: '',
  mondayCheck: false,
  thuesdayOpen: '',
  thuesdayClose: '',
  thuesdayOpen2: '',
  thuesdayClose2: '',
  thuesdayCheck: false,
  wednesdayOpen: '',
  wednesdayClose: '',
  wednesdayOpen2: '',
  wednesdayClose2: '',
  wednesdayCheck: false,
  thursdayOpen: '',
  thursdayClose: '',
  thursdayOpen2: '',
  thursdayClose2: '',
  thursdayCheck: false,
  fridayOpen: '',
  fridayClose: '',
  fridayOpen2: '',
  fridayClose2: '',
  fridayCheck: false,
  saturdayOpen: '',
  saturdayClose: '',
  saturdayOpen2: '',
  saturdayClose2: '',
  saturdayCheck: false,
  sundayOpen: '',
  sundayClose: '',
  sundayOpen2: '',
  sundayClose2: '',
  sundayCheck: false,
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
