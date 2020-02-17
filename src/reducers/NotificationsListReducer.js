import {
  ON_NOTIFICATIONS_READING,
  ON_NOTIFICATIONS_READ,
  ON_NOTIFICATIONS_READ_FAIL,
  ON_NOTIFICATION_DELETED,
  ON_NOTIFICATION_DELETED_FAIL,
  ON_NOTIFICATIONS_SET_READ
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = { notifications: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_NOTIFICATIONS_READING:
      return { ...state, loading: true };

    case ON_NOTIFICATIONS_READ:
      return { ...state, notifications: action.payload, loading: false };

    case ON_NOTIFICATIONS_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, loading: false };

    case ON_NOTIFICATION_DELETED:
      Toast.show({ text: 'Notificación borrada.' });

      return state;

    case ON_NOTIFICATION_DELETED_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state };

    case ON_NOTIFICATIONS_SET_READ:
      return { ...state };

    default:
      return state;
  }
};
