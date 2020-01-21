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
      querySnapshot.forEach(doc => tokens.push(doc.id));
      return tokens;
    })
    .catch(err => console.error(err));
};

const onClientPushNotificationTokensRead = clientId => {
  const db = firebase.firestore();
  const tokens = [];

  return db
    .collection(`Profiles/${clientId}/PushNotificationTokens`)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => tokens.push(doc.id));
      return tokens;
    })
    .catch(err => console.error(err));
};

export const onCommercePushNotificationSend = (notification, commerceId) => {
  onCommercePushNotificationTokensRead(commerceId).then(tokens => {
    const collectionPath = `Commerces/${commerceId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionPath });
  });
};

// Se va a usar en el futuro
export const onClientNotificationSend = (notification, clientId) => {
  onClientPushNotificationTokensRead(clientId).then(tokens => {
    const collectionPath = `Profiles/${clientId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionPath });
  });
};

const sendPushNotification = ({ title, body, tokens, collectionPath }) => {
  try {
    if (Array.isArray(tokens) && tokens.length) {
      tokens.forEach(async token => {
        const message = {
          to: token,
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

      // Se guarda el deviceToken en la colección del cliente
      await db
        .doc(
          `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
        )
        .set({});

      await db
        .doc(`Profiles/${currentUser.uid}`)
        .get()
        .then(async doc => {
          if (doc.data().commerceId != null)
            // Se guarda el deviceToken en la colección del comercio donde es dueño
            db.doc(
              `Commerces/${
                doc.data().commerceId
              }/PushNotificationTokens/${deviceToken}`
            ).set({ profileId: currentUser.uid });

          // Se guarda el deviceToken en las colecciónes de los comercios donde es empleado
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

      // Se elimina el deviceToken en la colección del cliente
      await db
        .doc(
          `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
        )
        .delete();
      if (commerceId !== null) {
        // Se elimina el deviceToken en la colección del comercio donde es dueño
        await db
          .doc(`Commerces/${commerceId}/PushNotificationTokens/${deviceToken}`)
          .delete();
      }

      // Se elimina el deviceToken en las colecciónes de los comercios donde es empleado
      await db
        .collection(`Profiles/${currentUser.uid}/Workplaces`)
        .where('softDelete', '==', null)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(async employee => {
              await db
                .doc(
                  `Commerces/${
                    employee.data().commerceId
                  }/PushNotificationTokens/${deviceToken}`
                )
                .delete();
            });
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};
