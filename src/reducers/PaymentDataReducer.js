import {
  ON_PAYMENT_METHOD_READ,
  ON_PAYMENT_METHOD_READ_FAIL,
  ON_PAYMENT_METHOD_READING
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  method: '',
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_PAYMENT_METHOD_READING:
      return { ...state, loading: true };
    case ON_PAYMENT_METHOD_READ:
      return { method: action.payload, loading: false };
    case ON_PAYMENT_METHOD_READ_FAIL:
      Toast.show({
        text: 'Ha ocurrido un error. Vuelva a intentarlo más tarde.'
      });
      return { ...INITIAL_STATE, loading: false };
    default:
      return state;
  }
};
