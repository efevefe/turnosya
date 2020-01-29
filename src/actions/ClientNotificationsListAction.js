import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_CLIENT_NOTIFICATIONS_READ,
  ON_CLIENT_NOTIFICATIONS_READING,
  ON_CLIENT_NOTIFICATIONS_DELETED
} from './types';

export const onClientNotificationsRead = clientId => dispatch => {
  dispatch({ type: ON_CLIENT_NOTIFICATIONS_READING });

  const db = firebase.firestore();

  return (
    db
      .collection(`Profiles/${clientId}/Notifications`)
      .where('softDelete', '==', null)
      /*     .where('date', '<=', moment().subtract(1,'month').toDate())*/
     //.orderBy('date','desc')
      .limit(50)
      .onSnapshot(snapshot => {
        const notifications = [];
        let processedItems = 0;
        if (snapshot.empty) {
          return dispatch({
            type: ON_CLIENT_NOTIFICATIONS_READ,
            payload: notifications
          });
        }
        snapshot.forEach(doc => {
          notifications.push({ ...doc.data(), id: doc.id });
          processedItems++;

          if (processedItems === snapshot.size) {
            dispatch({
              type: ON_CLIENT_NOTIFICATIONS_READ,
              payload: notifications
            });
          }
        });
      })
  );
};

//Registra la notificacion como eliminada
export const onClientNotificationDelete = ({ clientId, notificationId }) => {
  const db = firebase.firestore();
  return dispatch => {
    db.doc(`Profiles/${clientId}/Notifications/${notificationId}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_CLIENT_NOTIFICATIONS_DELETED }));
  };
};
