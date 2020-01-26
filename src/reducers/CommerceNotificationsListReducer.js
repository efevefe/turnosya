import {
  ON_COMMERCE_NOTIFICATIONS_READING,
  ON_COMMERCE_NOTIFICATIONS_READ,
  ON_COMMERCE_NOTIFICATIONS_READ_FAIL,
  ON_COMMERCE_NOTIFICATIONS_DELETED,
  ON_COMMERCE_NOTIFICATIONS_DELETED_FAIL
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = { notifications: [], loading: true };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_NOTIFICATIONS_READING:
      return { ...state, loading: true };

    case ON_COMMERCE_NOTIFICATIONS_READ:
      return {...state, notifications: action.payload, loading: false };

    case ON_COMMERCE_NOTIFICATIONS_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, loading: false };
    case ON_COMMERCE_NOTIFICATIONS_DELETED:
      Toast.show({ text: 'Notificacion borrada.' });
      return {...state}
    case ON_COMMERCE_NOTIFICATIONS_DELETED_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
    default:
      return state;
  }
};
