import {
  ON_COURT_VALUE_CHANGE,
  ON_COURT_CREATE,
  ON_COURT_FORM_SUBMIT,
  ON_COURT_EXISTS,
  ON_COURT_FORM_OPEN,
  ON_COURT_UPDATE,
  ON_COURT_DELETE
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  id: '',
  name: '',
  courts: [],
  court: '',
  grounds: [],
  ground: '',
  price: '',
  lightPrice: '',
  courtState: true,
  disabled: false,
  disabledFrom: null,
  disabledTo: null,
  loading: false,
  existsError: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COURT_VALUE_CHANGE:
      return { ...state, ...action.payload, existsError: '' };

    case ON_COURT_FORM_OPEN:
      return { ...INITIAL_STATE };

    case ON_COURT_FORM_SUBMIT:
      return { ...state, loading: true, existsError: '' };

    case ON_COURT_CREATE:
      Toast.show({ text: 'Cancha guardada' });
      return { ...INITIAL_STATE };

    case ON_COURT_UPDATE:
      Toast.show({ text: 'Cambios guardados' });
      return { ...INITIAL_STATE };

    case ON_COURT_DELETE:
      Toast.show({ text: 'La cancha se ha eliminado' });
      return { ...INITIAL_STATE };

    case ON_COURT_EXISTS:
      return {
        ...state,
        loading: false,
        existsError: 'Nombre de cancha existente'
      };

    default:
      return state;
  }
};
