import { ON_TOKEN_NOTIFICATION_READ, ON_TOKEN_NOTIFICATION_READ_FAIL,ON_TOKEN_NOTIFICATION_SAVED,ON_TOKEN_NOTIFICATION_SAVED_FAIL } from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export const readTokenNotificationOfCommerce = commerceId  => {
  const db = firebase.firestore();
  return dispatch => { db
    .collection(`Commerces/${commerceId}/Token`)
    .get()
    .then(querySnapshot => {
      const tokens = [];
      querySnapshot.forEach(doc =>tokens.push(doc.id));
      dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
    })
    .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
}};

export const readTokenNotificationOfCient = clientId => {
  const db = firebase.firestore();

  return dispatch => { db
    .collection(`Profiles/${clientId}/Token`)
    .get()
    .then(querySnapshot => {  
      const  tokens = [];
      querySnapshot.forEach(doc => tokens.push(doc.id ));
      dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
    })
    .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
}};

export const sendPushNotification = async (title,body,token) => {
      debugger;
  const message = {
    to:token,
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
  
};

export const registerForPushNotifications = async () => {

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
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
    let token = await Notifications.getExpoPushTokenAsync();

    db.doc(`Profiles/${currentUser.uid}/Token/${token}`)
      .set({})
  } else {
    alert('Must use physical device for Push Notifications');
  }
};
