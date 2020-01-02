import {
  ON_TOKEN_NOTIFICATION_READ,
  ON_TOKEN_NOTIFICATION_READ_FAIL
} from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export const readCommerceTokenNotification = commerceId => {
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

export const readCientTokenNotification = clientId => {
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

export const sendPushNotification = ({ title, body, tokens, connection }) => {
  if (tokens.length > 0) {
    tokens.forEach(async token => {
      if (token.activity === 1) {
        const message = {
          to: token.token,
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
        debugger;
        const data = response.status;
      }
    });
    const db = firebase.firestore();
    db.collection(connection).add({ title, body, date: new Date() });
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
          db.doc(`Commerces/${doc.data().commerceId}/Token/${token}`).set({
            activity: 1
          });
      });
  } else {
    alert('Must use physical device for Push Notifications');
  }
};

/* export const registerTokenOnLogout = async (currentUser, commerceId) => {
  // let token = await
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
    db.doc(`Profiles/${currentUser}/Token/${token}`).set({ activity: 22 });
    db.doc(`Commerces/${commerceId}/Token/${token}`).set({ activity: 0 });
  } else {
    alert('Must use physical device for Push Notifications');
  }
}; */

export const getToken = async commerceId => {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();
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
    await db
      .doc(`Profiles/${currentUser.uid}/Token/${token}`)
      .set({ activity: 0 });
    if (commerceId !== null)
      await db
        .doc(`Commerces/${commerceId}/Token/${token}`)
        .set({ activity: 0 });
  } else {
    alert('Must use physical device for Push Notifications');
  }
};
