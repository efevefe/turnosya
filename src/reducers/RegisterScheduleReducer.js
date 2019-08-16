import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT,
  ON_SCHEDULE_CARD_VALUE_CHANGE
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
  loading: false,
  refresh: false
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
      
      var newCards = state.cards.map((card, id) => {
        if (id !== newCard.id) {
          return card;
        }

        return { ...card, ...newCard };
      })

      return { ...state, cards: newCards };
    case SCHEDULE_FORM_SUBMIT:
      return { ...state, loading: true };
    default:
      return state;
  }
};
