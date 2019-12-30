import {
  ON_TOKEN_NOTIFICATION_READ,
  ON_TOKEN_NOTIFICATION_READ_FAIL,
  ON_TOKEN_NOTIFICATION_SAVED,
  ON_TOKEN_NOTIFICATION_SAVED_FAIL
} from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export const readTokenNotificationOfCommerce = commerceId => {
  const db = firebase.firestore();
  return dispatch => {
    db.collection(`Commerces/${commerceId}/Token`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc =>
          tokens.push({ token: doc.id, activity: doc.data().activity })
        );
        dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
  };
};

export const readTokenNotificationOfCient = clientId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Profiles/${clientId}/Token`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc => tokens.push(doc.id));
        dispatch({ type: ON_TOKEN_NOTIFICATION_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_TOKEN_NOTIFICATION_READ_FAIL }));
  };
};

export const sendPushNotification = async (title, body, token) => {
  for (let i = 0; i < token.length; i++) {
    if (token[i].activity === 1) {
      debugger;
      const message = {
        to: token[i].token,
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
      const data = response.status;
    }
  }
};

export const registerForClientPushNotifications = async () => {
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

    db.doc(`Profiles/${currentUser.uid}/Token/${token}`).set({ activity: 1 });
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        if (doc.data().commerceId != null)
          db.doc(
            `Commerces/${
              doc.data().commerceId
            }/Token/${token}`
          ).set({ activity: 1 });
      });
  } else {
    alert('Must use physical device for Push Notifications');
  }
};

export const registerTokenOnLogout = async (user, db, commerceId) => {
  debugger;
  // let token = await 
  getToken().then(token => {
    db.doc(`Profiles/${user}/Token/${token}`).set({ activity: 0 });
  db.doc(
    `Commerces/${commerceId}/Token/${token}`
  ).set({ activity: 0 });
  });
  
};

export const getToken = async () => {
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
    return token;
  } else {
    alert('Must use physical device for Push Notifications');
  }
};
