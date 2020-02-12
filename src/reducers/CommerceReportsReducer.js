import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE,
  ON_COMMERCE_REPORT_VALUE_RESET,
  ON_COMMERCE_REPORT_DATA_EMPTY,
  ON_COMMERCE_REPORT_DATA_ERROR
} from '../actions/types';
import moment from 'moment';

const INITIAL_STATE = {
  data: { labels: ['A'], data: [0] },
  startDate: moment().subtract(7, 'd'),
  endDate: moment(),
  loading: false,
  selectedYear: moment().format('YYYY'),
  years: [],
  selectedEmployee: { id: null, name: null },
  error: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_REPORT_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_COMMERCE_REPORT_VALUE_RESET:
      return { ...INITIAL_STATE };

    case ON_COMMERCE_REPORT_READING:
      return { ...state, data: INITIAL_STATE.data, loading: true };

    case ON_COMMERCE_REPORT_READ:
      return { ...state, data: action.payload, loading: false, error: '' };

    case ON_COMMERCE_REPORT_DATA_EMPTY:
      return { ...state, data: { labels: [], data: [] }, loading: false };

    case ON_COMMERCE_REPORT_DATA_ERROR:
      return {
        ...state,
        error: 'El dato seleccionado no es válido',
        loading: false
      };

    default:
      return state;
  }
};
