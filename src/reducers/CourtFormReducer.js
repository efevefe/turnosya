import {
  ON_COURT_VALUE_CHANGE,
  COURT_CREATE,
  COURT_FORM_SUBMIT,
  COURT_EXISTS,
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
  disabledFrom: null,
  disabledTo: null,
  loading: false,
  existsError: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_VALUE_CHANGE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        existsError: ''
      };
    case ON_COURT_FORM_OPEN:
      return INITIAL_STATE;
    case COURT_FORM_SUBMIT:
      return { ...state, loading: true, existsError: '' };
    case COURT_CREATE:
      Toast.show({ text: 'Cancha guardada' });
      return INITIAL_STATE;
    case COURT_UPDATE:
      Toast.show({ text: 'Cambios guardados' });
      return INITIAL_STATE;
    case COURT_DELETE:
      Toast.show({ text: 'La cancha se ha eliminado' });
      return INITIAL_STATE;
    case COURT_EXISTS:
      return { ...state, loading: false, existsError: 'Nombre de cancha existente' };
    default:
      return state;
  }
};
