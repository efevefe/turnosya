import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_NOTIFICATIONS_READ,
  ON_NOTIFICATIONS_READING,
  ON_NOTIFICATION_DELETED,
  ON_NOTIFICATIONS_SET_READ
} from './types';
import moment from 'moment';

export const onCommerceNotificationsRead = commerceId => {
  const collectionRef = `Commerces/${commerceId}/Notifications`;
  return onNotificationsRead(collectionRef);
};

export const onClientNotificationsRead = clientId => {
  const collectionRef = `Profiles/${clientId}/Notifications`;
  return onNotificationsRead(collectionRef);
};

onNotificationsRead = collectionRef => dispatch => {
  dispatch({ type: ON_NOTIFICATIONS_READING });

  const db = firebase.firestore();

  return db
    .collection(collectionRef)
    .where('softDelete', '==', null)
    .orderBy('date', 'desc')
    .limit(50)
    .onSnapshot(snapshot => {
      const notifications = [];

      if (snapshot.empty) {
        return dispatch({
          type: ON_NOTIFICATIONS_READ,
          payload: notifications
        });
      }

      snapshot.forEach(doc => {
        notifications.push({ ...doc.data(), id: doc.id, date: moment(doc.data().date.toDate()) });

        if (notifications.length === snapshot.size) {
          dispatch({
            type: ON_NOTIFICATIONS_READ,
            payload: notifications
          });
        }
      });
    });
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
onNotificationDelete = collectionRef => {
  const db = firebase.firestore();
  return dispatch => {
    db.doc(collectionRef)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_NOTIFICATION_DELETED }));
  };
};

export const onClientSetNotificationsRead = (clientId, notifications) => {
  const collectionRef = `Profiles/${clientId}/Notifications/`;
  onSetNotificationsRead(collectionRef, notifications);
};

export const onCommerceSetNotificationsRead = (commerceId, notifications) => {
  const collectionRef = `Commerces/${commerceId}/Notifications/`;
  onSetNotificationsRead(collectionRef, notifications);
};

onSetNotificationsRead = (collectionRef, notifications) => {
  const db = firebase.firestore();
  notifications.forEach(notification => {
    if (!notification.read) db.doc(collectionRef + notification.id).update({ read: 1 });
  });
};
