import {
  ON_SERVICE_VALUE_CHANGE,
  ON_FORM_OPEN,
  SERVICE_FORM_SUBMIT,
  SERVICE_CREATE,
  SERVICE_UPDATE,
  SERVICE_DELETE
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

    case SERVICE_FORM_SUBMIT:
      return { ...state, loading: true };

    case SERVICE_CREATE:
      Toast.show({ text: 'Servicio guardado' });
      return { ...INITIAL_STATE };

    case SERVICE_UPDATE:
      Toast.show({ text: 'Cambios guardados' });
      return { ...INITIAL_STATE };

    case SERVICE_DELETE:
      Toast.show({ text: 'El servicio se ha eliminado' });
      return { ...INITIAL_STATE };

    default:
      return state;
  }
};
