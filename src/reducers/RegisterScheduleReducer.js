import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT,
  ON_SCHEDULE_CARD_VALUE_CHANGE,
  ON_SCHEDULE_CARD_DELETE,
  ON_SCHEDULE_SHIFTS_READ,
  ON_SCHEDULE_SHIFTS_READING
} from '../actions/types';

const INITIAL_STATE = {
  cards: [
    {
      id: 0,
      firstOpen: '',
      firstClose: '',
      days: []
    }
  ],
  selectedDays: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_FORM_OPEN:
      return INITIAL_STATE;
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
      })

      return { ...state, cards: newCards };
    case ON_SCHEDULE_CARD_DELETE:
      const cardToDelete = state.cards.find(card => card.id === action.payload);
      var newSelectedDays = state.selectedDays.filter(day => !cardToDelete.days.includes(day));
      var newCards = state.cards.filter(card => card.id !== cardToDelete.id);

      return { ...state, cards: newCards, selectedDays: newSelectedDays };
    case ON_SCHEDULE_SHIFTS_READING:
      return { ...state, loading: true };
    case ON_SCHEDULE_SHIFTS_READ:
      return { ...INITIAL_STATE, ...action.payload };
    case SCHEDULE_FORM_SUBMIT:
      return { ...state, loading: true };
    default:
      return state;
  }
};
