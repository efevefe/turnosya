import {
  ON_SCHEDULE_READ,
  ON_SCHEDULE_READING,
  ON_SCHEDULE_READ_FAIL,
  ON_SCHEDULE_VALUE_CHANGE
} from '../actions/types';
import moment from 'moment';

const INITIAL_STATE = {
  cards: [
    {
      id: 0,
      firstShiftStart: '',
      firstShiftEnd: '',
      secondShiftStart: null,
      secondShiftEnd: null,
      days: []
    }
  ],
  selectedDays: [],
  reservationDayPeriod: 0,
  reservationMinLength: 0,
  selectedDate: moment(),
  loading: false,
  refreshing: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_VALUE_CHANGE:
      const { prop, value } = action.payload;

      return { ...state, [prop]: value };
    case ON_SCHEDULE_READING:
      return { ...state, loading: true };
    case ON_SCHEDULE_READ:
      return { ...INITIAL_STATE, ...action.payload };
    case ON_SCHEDULE_READ_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};