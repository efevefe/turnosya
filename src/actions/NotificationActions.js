import {
  ON_NOTIFICATION_TOKENS_READ,
  ON_NOTIFICATION_TOKENS_READ_FAIL
} from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Toast, Menu } from '../components/common';

export const readCommerceNotificationTokens = commerceId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${commerceId}/Tokens`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc =>
          tokens.push({ token: doc.id})
        );
        dispatch({ type: ON_NOTIFICATION_TOKENS_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_NOTIFICATION_TOKENS_READ_FAIL }));
  };
};

export const readClientNotificationTokens = clientId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Profiles/${clientId}/Tokens`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc => tokens.push(doc.id));
        dispatch({ type: ON_NOTIFICATION_TOKENS_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_NOTIFICATION_TOKENS_READ_FAIL }));
  };
};
export const sendNotificationsTuCommerce = (notificacion, commerceId) => {
  const path = `Commerces/${commerceId}/Notifications`;
  sendPushNotification(notificacion, path);
};

export const sendNotificationsTuClient = (notificacion, clientId) => {
  const path = `Profiles/${clientId}/Notifications`;
  sendPushNotification(notificacion, path);
};

export const sendPushNotification = (notification, path) => {
  const { title, body, tokens } = notification;
  if (tokens.length) {
    tokens.forEach(async token => {
        const message = {
          to: token.token,
          sound: 'default',
          title,
          body,
          _displayInForeground: true
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
    );
    const db = firebase.firestore();
    db.collection(path).add({ title, body, date: new Date() });
  }
};

export const onPushNotificationTokenRegister = async () => {
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
      Toast.show({
        text: 'No se pudo enlazar el dispositivo para el uso de notificaciones'
      });
    }
    let token = await Notifications.getExpoPushTokenAsync();

    // Se registra el token asociado a cada cuenta, puede ser mas de uno
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    db.doc(`Profiles/${currentUser.uid}/Tokens/${token}`).set({})
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        if (doc.data().commerceId != null)
          db.doc(`Commerces/${doc.data().commerceId}/Tokens/${token}`).set({});
      });
  } else {
    Toast.show({
      text: 'Debe usar un dispositivo físico para el uso de notificaciones'
    });
  }
};

export const getToken = async commerceId => {
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
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    await db
      .doc(`Profiles/${currentUser.uid}/Tokens/${token}`).delete()
      if (commerceId !== null)
      await db
        .doc(`Commerces/${commerceId}/Tokens/${token}`).delete()
      } else {
    Toast.show({
      text: 'Debe usar un dispositivo físico para el uso de notificaciones'
    });
  }
};
