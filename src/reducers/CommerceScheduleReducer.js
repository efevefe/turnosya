import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  ON_SCHEDULE_CARD_VALUE_CHANGE,
  ON_SCHEDULE_CARD_DELETE,
  ON_SCHEDULE_READ,
  ON_SCHEDULE_READING,
  ON_SCHEDULE_READ_FAIL,
  ON_SCHEDULE_CREATING,
  ON_SCHEDULE_CREATED,
  ON_SCHEDULE_CREATE_FAIL,
  ON_SCHEDULE_CONFIG_UPDATING,
  ON_SCHEDULE_CONFIG_UPDATED,
  ON_SCHEDULE_READ_EMPTY,
  ON_ACTIVE_SCHEDULES_READ,
  ON_ACTIVE_SCHEDULES_READING,
  ON_ACTIVE_SCHEDULES_READ_FAIL
} from '../actions/types';
import moment from 'moment';
import { Toast } from '../components/common';

const INITIAL_WORKSHIFTS = {
  id: '',
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
  startDate: null,
  endDate: null,
  reservationMinLength: 60,
  employeeId: null
};

const INITIAL_STATE = {
  ...INITIAL_WORKSHIFTS,
  schedules: [],
  reservationDayPeriod: 14,
  reservationMinCancelTime: 2,
  error: null,
  slots: [],
  loading: false,
  loadingSchedule: false,
  refreshing: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_READ_EMPTY:
    case ON_SCHEDULE_FORM_OPEN:
      return {
        ...state,
        ...INITIAL_WORKSHIFTS,
        startDate: moment(moment().format('MM-DD-YYYY')),
        loadingSchedule: false
      };

    case ON_SCHEDULE_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_SCHEDULE_CARD_VALUE_CHANGE:
      const newCard = action.payload;
      var newCards = state.cards.map(card => {
        if (card.id !== newCard.id) return card;

        return { ...card, ...newCard };
      });

      return { ...state, cards: newCards };

    case ON_SCHEDULE_CARD_DELETE:
      const cardToDelete = state.cards.find(card => card.id === action.payload);
      const newSelectedDays = state.selectedDays.filter(day => !cardToDelete.days.includes(day));
      var newCards = state.cards.filter(card => card.id !== cardToDelete.id);

      return { ...state, cards: newCards, selectedDays: newSelectedDays };

    case ON_ACTIVE_SCHEDULES_READING:
    case ON_SCHEDULE_CONFIG_UPDATING:
      return { ...state, loading: true };

    case ON_SCHEDULE_READING:
      return { ...state, loadingSchedule: true };

    case ON_SCHEDULE_READ:
      return { ...state, ...action.payload, loadingSchedule: false };

    case ON_ACTIVE_SCHEDULES_READ:
      return { ...state, schedules: action.payload, loading: false };

    case ON_SCHEDULE_CONFIG_UPDATED:
      Toast.show({ text: 'Cambios guardados' });

    case ON_ACTIVE_SCHEDULES_READ_FAIL:
      return { ...state, loading: false };

    case ON_SCHEDULE_READ_FAIL:
      return { ...state, loadingSchedule: false };

    case ON_SCHEDULE_CREATING:
      return { ...state, refreshing: true };

    case ON_SCHEDULE_CREATED:
      Toast.show({ text: 'Cambios guardados' });
      return { ...state, refreshing: false };

    case ON_SCHEDULE_CREATE_FAIL:
      Toast.show({ text: 'Se ha producido un error, intente nuevamente' });
      return { ...state, loading: false, refreshing: false };

    case ON_SCHEDULE_CONFIG_UPDATING:
      return { ...state, loading: true };

    default:
      return state;
  }
};
