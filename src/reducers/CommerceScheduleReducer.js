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
  ON_COMMERCE_LAST_COURT_RESERVATION_READ,
  ON_COMMERCE_LAST_COURT_RESERVATION_READ_FAIL,
  ON_ACTIVE_SCHEDULES_READ
} from '../actions/types';
import { Toast } from '../components/common';

// revisar esto
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
  reservationMinLength: 30
}

const INITIAL_STATE = {
  ...INITIAL_WORKSHIFTS,
  schedules: [],
  reservationDayPeriod: 14,
  lastReservationDate: null,
  error: null,
  slots: [],
  loading: false,
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_FORM_OPEN:
      return { ...state, ...INITIAL_WORKSHIFTS };
    case ON_SCHEDULE_VALUE_CHANGE:
      const { prop, value } = action.payload;

      return { ...state, [prop]: value };
    case ON_SCHEDULE_CARD_VALUE_CHANGE:
      const newCard = action.payload;
      var newCards = state.cards.map(card => {
        if (card.id !== newCard.id) {
          return card;
        }

        return { ...card, ...newCard };
      });

      return { ...state, cards: newCards };
    case ON_SCHEDULE_CARD_DELETE:
      const cardToDelete = state.cards.find(card => card.id === action.payload);
      const newSelectedDays = state.selectedDays.filter(
        day => !cardToDelete.days.includes(day)
      );
      var newCards = state.cards.filter(card => card.id !== cardToDelete.id);

      return { ...state, cards: newCards, selectedDays: newSelectedDays };
    case ON_SCHEDULE_READING:
      return { ...state, loading: true };
    case ON_SCHEDULE_READ:
      return { ...state, ...action.payload, loading: false };
    case ON_ACTIVE_SCHEDULES_READ: // este capaz ni hace falta, se podria usar la misma otra action
      return { ...state, schedules: action.payload, loading: false };
    case ON_SCHEDULE_READ_EMPTY:
      Toast.show({ text: 'Aun no hay horarios de atencion' });

      return INITIAL_STATE;
    case ON_SCHEDULE_READ_FAIL:
      return { ...state, loading: false };
    case ON_SCHEDULE_CREATING:
      return { ...state, refreshing: true };
    case ON_SCHEDULE_CREATED:
      Toast.show({ text: 'Cambios guardados' });

      return { ...state, refreshing: false };
    case ON_SCHEDULE_CREATE_FAIL:
      Toast.show({ text: 'Se ha producido un error, intente nuevamente' });

      return { ...state, refreshing: false };
    case ON_SCHEDULE_CONFIG_UPDATING:
      return { ...state, loading: true };
    case ON_SCHEDULE_CONFIG_UPDATED:
      Toast.show({ text: 'Cambios guardados' });

      return { ...state, loading: false };
    case ON_COMMERCE_LAST_COURT_RESERVATION_READ:
      return { ...state, error: null, lastReservationDate: action.payload };
    case ON_COMMERCE_LAST_COURT_RESERVATION_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, intente nuevamente' });

      return { ...state, error: action.payload };
    default:
      return state;
  }
};
