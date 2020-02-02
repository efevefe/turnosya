import {
  ON_NOTIFICATIONS_READING,
  ON_NOTIFICATIONS_READ,
  ON_NOTIFICATIONS_READ_FAIL,
  ON_NOTIFICATIONS_DELETED,
  ON_NOTIFICATIONS_DELETED_FAIL
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
    case ON_NOTIFICATIONS_DELETED:
      Toast.show({ text: 'Notificación borrada.' });
      const notificationsUpdate = state.notifications.filter(element => {
        if (element !== action.payload) {
          return element;
        }
      });
      return { ...state, notifications: notificationsUpdate };
    case ON_NOTIFICATIONS_DELETED_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return {...state}
    default:
      return state;
  }
};