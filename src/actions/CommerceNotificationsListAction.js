import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_NOTIFICATIONS_READ,
  ON_COMMERCE_NOTIFICATIONS_READING
} from './types';
import moment from 'moment';

export const onCommerceNotificationsRead = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_NOTIFICATIONS_READING });

  const db = firebase.firestore();
  let notifications = [];

  return (
    db
      .collection(`Commerces/${commerceId}/Notifications`)
      .where('softDelete', '==', null)
      //.where('date', '>', moment().subtract(1, 'months'))
      .onSnapshot(snapshot => {
        snapshot.forEach(doc =>
          notifications.push({ ...doc.data(), id: doc.id })
        );
        dispatch({
          type: ON_COMMERCE_NOTIFICATIONS_READ,
          payload: notifications
        });
      })
  );
};

// Marca a la notificacion como leida
export const setState = (commerceId, notificationId) => {
  const db = firebase.firestore();

  db.doc(`Commerces/${commerceId}/Notifications/${notificationId}`)
    .update({ state: 1 })
};
