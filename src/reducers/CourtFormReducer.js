import {
  ON_COURT_VALUE_CHANGE,
  COURT_CREATE,
  COURT_FORM_SUBMIT,
  COURT_EXISTED,
  ON_COURT_FORM_OPEN,
  COURT_UPDATE,
  COURT_DELETE
} from '../actions/types';
import { Toast } from '../components/common';

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
        Toast.show({ text: 'Cancha guardada' });
      return INITIAL_STATE;
    case COURT_UPDATE:
        Toast.show({ text: 'Cambios guardados' });
      return INITIAL_STATE;
    case COURT_DELETE:
        Toast.show({ text: 'La cancha se ha eliminado' });
      return INITIAL_STATE;
    case COURT_EXISTED:
      return { ...state, loading: false, existedError: true };
    default:
      return state;
  }
};
