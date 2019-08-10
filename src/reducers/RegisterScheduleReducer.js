import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT
} from '../actions/types';

const INITIAL_STATE = {
  cards: [],
  selectedDays: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SCHEDULE_FORM_OPEN:
      return INITIAL_STATE;
    case ON_SCHEDULE_VALUE_CHANGE:
      const { prop, value } = action.payload;

      if (prop === 'selectedDays' || prop === 'loading' || prop === 'cards')
        return { ...state, [prop]: value };

      const cardChanged = { ...card[value.id], [prop]: value.value };

      return { ...state, cards: [...cards, cardChanged] };
    case SCHEDULE_FORM_SUBMIT:
      return { ...state, loading: true };
    default:
      return state;
  }
};
