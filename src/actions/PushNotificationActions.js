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

const onCommercePushNotificationTokensRead = commerceId => {
  const db = firebase.firestore();
  const tokens = [];

  return db
    .collection(`Commerces/${commerceId}/PushNotificationTokens`)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => tokens.push({ token: doc.id }));
      return tokens;
    })
    .catch(() => 'perri');
};

// FVF esta no se usa, ya se
export const onClientPushNotificationTokensRead = clientId => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Profiles/${clientId}/PushNotificationTokens`)
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
  onCommercePushNotificationTokensRead(commerceId).then(tokens => {
    const collectionPath = `Commerces/${commerceId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionPath });
  });
};

// FVF esta no se usa
export const onClientNotificationSend = (notification, clientId) => {
  onCommercePushNotificationTokensRead(commerceId).then(tokens => {
    const collectionPath = `Profiles/${clientId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionPath });
  });
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

      // guarda el token en la coleccion del cliente
      db.doc(
        `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
      ).set({});

      db.doc(`Profiles/${currentUser.uid}`)
        .get()
        .then(doc => {
          if (doc.data().commerceId != null)
            // guarda el token en el comercio donde es dueño
            db.doc(
              `Commerces/${
                doc.data().commerceId
              }/PushNotificationTokens/${deviceToken}`
            ).set({ profileId: currentUser.uid });
            // guarda el token en el comercio donde es empleado
          db.collection(`Profiles/${currentUser.uid}/Workplaces`)
            .where('softDelete', '==', null)
            .get()
            .then(querySnapshot => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach(employee =>
                  db
                    .doc(
                      `Commerces/${
                        employee.data().commerceId
                      }/PushNotificationTokens/${deviceToken}`
                    )
                    .set({ profileId: currentUser.uid })
                );
              }
            });
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

      db.doc(
        `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
      ).delete();
      if (commerceId !== null) {
        db.doc(
          `Commerces/${commerceId}/PushNotificationTokens/${deviceToken}`
        ).delete();
      }
      db.collection(`Profiles/${currentUser.uid}/Workplaces`)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(employee =>
              db
                .doc(
                  `Commerces/${
                    employee.data().commerceId
                  }/PushNotificationTokens/${deviceToken}`
                )
                .delete()
            );
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};
