import {
  ON_NOTIFICATION_TOKENS_READ,
  ON_NOTIFICATION_TOKENS_READ_FAIL
} from './types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Toast } from '../components/common';

export const onCommercePushNotificationTokensRead = commerceId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${commerceId}/Tokens`)
      .get()
      .then(querySnapshot => {
        const tokens = [];
        querySnapshot.forEach(doc => tokens.push({ token: doc.id }));
        dispatch({ type: ON_NOTIFICATION_TOKENS_READ, payload: tokens });
      })
      .catch(() => dispatch({ type: ON_NOTIFICATION_TOKENS_READ_FAIL }));
  };
};

// FVF esta no se usa
export const onClientPushNotificationTokensRead = clientId => {
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

export const onCommercePushNotificationSend = (notification, commerceId) => {
  const collectionPath = `Commerces/${commerceId}/Notifications`;
  sendPushNotification({ ...notification, collectionPath });
};

// FVF esta no se usa
export const onClientNotificationSend = (notification, clientId) => {
  const collectionPath = `Profiles/${clientId}/Notifications`;
  sendPushNotification({ ...notification, collectionPath });
};

const sendPushNotification = ({ title, body, tokens, collectionPath }) => {
  try {
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
      });

      const db = firebase.firestore();
      db.collection(collectionPath).add({ title, body, date: new Date() });
    }
  } catch (e) {
    console.error(e);
  }
};

const getDeviceToken = async () => {
  // -1 (is simulator device) | 0 (permission not granted) | token value
  try {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return 0;
      }

      return await Notifications.getExpoPushTokenAsync();
    } else {
      Toast.show({
        text: 'Debe usar un dispositivo físico para el uso de notificaciones'
      });
      return -1;
    }
  } catch (e) {
    console.error(e);
  }
};

export const onPushNotificationTokenRegister = async () => {
  try {
    const deviceToken = await getDeviceToken();

    if (deviceToken.length > 2) {
      // const tokenoftoken = deviceToken.substring(
      //   deviceToken.indexOf('[') + 1,
      //   deviceToken.length - 1
      // );
      const { currentUser } = firebase.auth();
      const db = firebase.firestore();

      db.doc(`Profiles/${currentUser.uid}/Tokens/${deviceToken}`).set({});
      db.doc(`Profiles/${currentUser.uid}`)
        .get()
        .then(doc => {
          if (doc.data().commerceId != null)
            db.doc(
              `Commerces/${doc.data().commerceId}/Tokens/${deviceToken}`
            ).set({});
        });
    }
  } catch (e) {
    console.error(e);
  }
};

export const onPushNotificationTokenDelete = async commerceId => {
  try {
    const deviceToken = await getDeviceToken();

    if (deviceToken.length > 2) {
      // const tokenoftoken = deviceToken.substring(
      //   deviceToken.indexOf('[') + 1,
      //   deviceToken.length - 1
      // );
      const { currentUser } = firebase.auth();
      const db = firebase.firestore();

      db.doc(`Profiles/${currentUser.uid}/Tokens/${deviceToken}`).delete();
      if (commerceId !== null)
        db.doc(`Commerces/${commerceId}/Tokens/${deviceToken}`).delete();
    }
  } catch (e) {
    console.error(e);
  }
};
