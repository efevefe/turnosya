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
    db.collection(`Commerces/${commerceId}/Token`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc =>
          tokens.push({ token: doc.id, activity: doc.data().activity })
        );
        dispatch({ type: ON_NOTIFICATION_TOKENS_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_NOTIFICATION_TOKENS_READ_FAIL }));
  };
};

export const readClientNotificationTokens = clientId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Profiles/${clientId}/Token`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc => tokens.push(doc.id));
        dispatch({ type: ON_NOTIFICATION_TOKENS_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_NOTIFICATION_TOKENS_READ_FAIL }));
  };
};

export const sendPushNotification = notification => {
  const { title, body, tokens, connection } = notification;
  if (tokens.length) {
    tokens.forEach(async token => {
      if (token.activity === 1) {
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
    });
    const db = firebase.firestore();
    db.collection(connection).add({ title, body, date: new Date() });
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
    let tokens = await Notifications.getExpoPushTokenAsync();

    // Se registra el token asociado a cada cuenta, puede ser mas de uno, junto a ese token se registra
    //un campo activity indicado si el usuario esta logueado en ese dispositivo,en este caso el activity es 1
    //y se procede a enviar la notificacion al dispositivo, en caso contrario es 0 y no se envia pero
    // igualmente se almacena en base de dato.
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    db.doc(`Profiles/${currentUser.uid}/Token/${tokens}`).set({ activity: 1 });
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        if (doc.data().commerceId != null)
          db.doc(`Commerces/${doc.data().commerceId}/Token/${tokens}`).set({
            activity: 1
          });
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
    let tokens = await Notifications.getExpoPushTokenAsync();
    const { currentUser } = firebase.auth();
    const db = firebase.firestore();
    await db
      .doc(`Profiles/${currentUser.uid}/Token/${tokens}`)
      .set({ activity: 0 });
    if (commerceId !== null)
      await db
        .doc(`Commerces/${commerceId}/Token/${tokens}`)
        .set({ activity: 0 });
  } else {
    Toast.show({
      text: 'Debe usar un dispositivo físico para el uso de notificaciones'
    });
  }
};
