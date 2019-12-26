import { ON_TOKEN_NOTIFICATION_READ, ON_TOKEN_NOTIFICATION_READ_FAIL,ON_TOKEN_NOTIFICATION_SAVED,ON_TOKEN_NOTIFICATION_SAVED_FAIL } from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const readTokenNotificationOfCommerce = commerceId  => {
  const db = firebase.firestore();
  return dispatch => { db
    .collection(`Commerces/${commerceId}/Notification`)
    .get()
    .then(querySnapshot => {
      const tokens = [];
      querySnapshot.forEach(doc => tokens.push(doc.id));
      dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
    })
    .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
}};

export const readTokenNotificationOfCient = clientId => {
  const db = firebase.firestore();

  return dispatch => { db
    .collection(`Profiles/${clientId}/Notification`)
    .get()
    .then(querySnapshot => {  
      const  tokens = [];
      querySnapshot.forEach(doc => tokens.push(doc.id));
      dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
    })
    .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
}};

export const sendPushNotification = async (title,body,token) => {
  for (let i = 0; i < token.length; i++) {
    debugger;
  const message = {
    to:token[i],
    sound: 'default',
    title,
    body,
    _displayInForeground: true,
    data: { data: 'goes here' }
  };
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
  const data = response._bodyInit;  
  }
};

export const registerForPushNotifications = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const db = firebase.firestore();
    let token = await Notifications.getExpoPushTokenAsync();
    db.doc(`Profiles/${clientId}/Notification/${token}`)
      .set({})
      .then(dispatch({ type: ON_TOKEN_NOTIFICATION_SAVED }))
      .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_SAVED_FAIL }));
  } else {
    alert('Must use physical device for Push Notifications');
  }
};
