import {
  ON_SERVICE_VALUE_CHANGE,
  ON_FORM_OPEN,
  ON_SERVICE_FORM_SUBMIT,
  ON_SERVICE_CREATE,
  ON_SERVICE_UPDATE,
  ON_SERVICE_DELETE
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  name: '',
  duration: '',
  price: '',
  description: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SERVICE_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_FORM_OPEN:
      return { ...INITIAL_STATE };

    case ON_SERVICE_FORM_SUBMIT:
      return { ...state, loading: true };

    case ON_SERVICE_CREATE:
      Toast.show({ text: 'Servicio guardado' });
      return { ...INITIAL_STATE };

    case ON_SERVICE_UPDATE:
      Toast.show({ text: 'Cambios guardados' });
      return { ...INITIAL_STATE };

    case ON_SERVICE_DELETE:
      Toast.show({ text: 'El servicio se ha eliminado' });
      return { ...INITIAL_STATE };

    default:
      return state;
  }
};
