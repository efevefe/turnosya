import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_NOTIFICATIONS_READ, ON_NOTIFICATIONS_READING, ON_NOTIFICATIONS_DELETED } from './types';

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

  return db
    .collection(collectionRef)
    .where('softDelete', '==', null)
   //no puedo crear indice  .orderBy('date','desc')
    .limit(50)
    .onSnapshot(snapshot => {
      
      if (snapshot.empty) {
        return dispatch({
          type: ON_NOTIFICATIONS_READ,
          payload: notifications
        });
      }
      const notifications = [];
      let processedItems = 0;
      snapshot.forEach(doc => {
        notifications.push({ ...doc.data(), id: doc.id });
        processedItems++;

        if (processedItems === snapshot.size) {
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
export const onNotificationDelete = collectionRef => {
  const db = firebase.firestore();
  return dispatch => {
    db.doc(collectionRef)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_NOTIFICATIONS_DELETED }));
  };
};