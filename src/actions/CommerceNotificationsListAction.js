import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_NOTIFICATIONS_READ,
  ON_COMMERCE_NOTIFICATIONS_READING,
  ON_COMMERCE_NOTIFICATIONS_DELETED,
  ON_COMMERCE_NOTIFICATIONS_DELETED_FAIL
} from './types';
import moment from 'moment';

export const onCommerceNotificationsRead = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_NOTIFICATIONS_READING });

  const db = firebase.firestore();

  return (
    db
      .collection(`Commerces/${commerceId}/Notifications`)
      .where('softDelete', '==', null)
      /*     .where('date', '<=', moment().subtract(1,'month').toDate())*/
      //.orderBy('date', 'asc')
      .limit(50)
      .onSnapshot(snapshot => {
        const notifications = [];
        let  processedItems = 0;

        if (snapshot.empty) {
          return dispatch({
            type: ON_COMMERCE_NOTIFICATIONS_READ,
            payload: notifications
          });
        }

        snapshot.forEach(doc => {
          notifications.push({ ...doc.data(), id: doc.id });
          processedItems++;

          if (processedItems === snapshot.size) {
            dispatch({
              type: ON_COMMERCE_NOTIFICATIONS_READ,
              payload: notifications
            });
          }
        });
      })
  );
};

//Registra la notificacion como eliminada
export const onCommerceNotificationDelete = ({ commerceId, notificationId }) => {
  const db = firebase.firestore();
  return dispatch => {
    db.doc(`Commerces/${commerceId}/Notifications/${notificationId}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_COMMERCE_NOTIFICATIONS_DELETED }));
  };
};
