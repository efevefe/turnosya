import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_NOTIFICATIONS_READ, ON_NOTIFICATIONS_READING, ON_NOTIFICATION_DELETED } from './types';
import moment from 'moment';

export const onCommerceNotificationsRead = commerceId => {
  const collectionRef = `Commerces/${commerceId}/Notifications`;
  return onNotificationsRead(collectionRef);
};

export const onClientNotificationsRead = clientId => {
  const collectionRef = `Profiles/${clientId}/Notifications`;
  return onNotificationsRead(collectionRef);
};

export const onNotificationsRead = collectionRef => dispatch => {
  dispatch({ type: ON_NOTIFICATIONS_READING });

  const db = firebase.firestore();

  return (
    db
      .collection(collectionRef)
      .where('softDelete', '==', null)
      //no puedo crear indice  .orderBy('date','desc')
      .limit(50)
      .onSnapshot(snapshot => {
        const notifications = [];
        let processedItems = 0;

        if (snapshot.empty) {
          return dispatch({
            type: ON_NOTIFICATIONS_READ,
            payload: notifications
          });
        }

        snapshot.forEach(doc => {
          notifications.push({ ...doc.data(), id: doc.id, date: moment(doc.data().date.toDate()) });
          processedItems++;

          if (notifications.length === snapshot.size) {
            dispatch({
              type: ON_NOTIFICATIONS_READ,
              payload: notifications
            });
          }
        });
      })
  );
};

export const onClientNotificationDelete = ({ clientId, notificationId }) => {
  const collectionRef = `Profiles/${clientId}/Notifications/${notificationId}`;
  return onNotificationDelete(collectionRef);
};

export const onCommerceNotificationDelete = ({ commerceId, notificationId }) => {
  const collectionRef = `Commerces/${commerceId}/Notifications/${notificationId}`;
  return onNotificationDelete(collectionRef);
};

//Registra la notificacion como eliminada
export const onNotificationDelete = collectionRef => {
  const db = firebase.firestore();
  return dispatch => {
    db.doc(collectionRef)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_NOTIFICATION_DELETED }));
  };
};
