import firebase from 'firebase/app';
import 'firebase/firestore';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Toast } from '../components/common';

const onCommercePushNotificationTokensRead = async commerceId => {
  const db = firebase.firestore();
  const tokens = [];
  return await db
    .collection(`Commerces/${commerceId}/PushNotificationTokens`)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => tokens.push(doc.id));
      return tokens;
    })
    .catch(error => console.error(error));
};

const onClientPushNotificationTokensRead = async clientId => {
  const db = firebase.firestore();
  const tokens = [];

  return await db
    .collection(`Profiles/${clientId}/PushNotificationTokens`)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => tokens.push(doc.id));
      return tokens;
    })
    .catch(error => console.error(error));
};

export const onCommercePushNotificationSend = (notification, commerceId) => {
  onCommercePushNotificationTokensRead(commerceId).then(tokens => {
    const collectionRef = `Commerces/${commerceId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionRef });
  });
};

export const onClientPushNotificationSend = (notification, clientId) => {
  onClientPushNotificationTokensRead(clientId).then(tokens => {
    const collectionRef = `Profiles/${clientId}/Notifications`;
    sendPushNotification({ ...notification, tokens, collectionRef });
  });
};

const sendPushNotification = ({ title, body, tokens, collectionRef }) => {
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
      db.collection(collectionRef).add({ title, body, date: new Date() });
    }
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
  }
};

export const onPushNotificationTokenRegister = async () => {
  try {
    const deviceToken = await getDeviceToken();
    // const deviceToken = 'ExponentPushToken[AKryxSG5_l0KFxxzyO8Wt6]';

    if (deviceToken.length > 2) {
      const { currentUser } = firebase.auth();
      const db = firebase.firestore();
      const batch = db.batch();

      // Se guarda el deviceToken en la colección del cliente
      const clientPushNotificationRef = db.doc(
        `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
      );

      batch.set(clientPushNotificationRef, {});

      await db
        .doc(`Profiles/${currentUser.uid}`)
        .get()
        .then(async doc => {
          if (doc.data().commerceId != null) {
            // Se guarda el deviceToken en la colección del comercio donde es dueño
            const commercePushNotificationRef = db.doc(
              `Commerces/${
                doc.data().commerceId
              }/PushNotificationTokens/${deviceToken}`
            );

            batch.set(commercePushNotificationRef, {
              profileId: currentUser.uid
            });
          }

          // Se guarda el deviceToken en las colecciónes de los comercios donde es empleado (con el id del employee)
          await db
            .collection(`Profiles/${currentUser.uid}/Workplaces`)
            .where('softDelete', '==', null)
            .get()
            .then(async querySnapshot => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach(async workplace => {
                  let commerceEmployeeId;
                  await db
                    .collection(
                      `Commerces/${workplace.data().commerceId}/Employees`
                    )
                    .get()
                    .then(async qSnapshot => {
                      if (!qSnapshot.empty) {
                        commerceEmployeeId = qSnapshot.docs.find(
                          employee =>
                            employee.data().profileId === currentUser.uid
                        );
                      }
                    });

                  const workplacePushNotificationRef = db.doc(
                    `Commerces/${
                      workplace.data().commerceId
                    }/PushNotificationTokens/${deviceToken}`
                  );

                  console.log('antes que este (no se esta esperando esto): ');

                  batch.set(workplacePushNotificationRef, {
                    employeeId: commerceEmployeeId.id
                  });
                });
              }
            });
        });
      console.log('se tira este commit');
      await batch.commit();
    }
  } catch (error) {
    console.error(error);
  }
};

export const onPushNotificationTokenDelete = async commerceId => {
  try {
    const deviceToken = await getDeviceToken();

    if (deviceToken.length > 2) {
      const { currentUser } = firebase.auth();
      const db = firebase.firestore();
      const batch = db.batch();

      // Se elimina el deviceToken en la colección del cliente
      const clientPushNotificationRef = db.doc(
        `Profiles/${currentUser.uid}/PushNotificationTokens/${deviceToken}`
      );

      batch.delete(clientPushNotificationRef);
      if (commerceId !== null) {
        // Se elimina el deviceToken en la colección del comercio donde es dueño
        const comercePushNotificationRef = db.doc(
          `Commerces/${commerceId}/PushNotificationTokens/${deviceToken}`
        );

        batch.delete(comercePushNotificationRef);
      }

      // Se elimina el deviceToken en las colecciónes de los comercios donde es empleado
      await db
        .collection(`Profiles/${currentUser.uid}/Workplaces`)
        .where('softDelete', '==', null)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(async employee => {
              const workplacePushNotificationRef = db.doc(
                `Commerces/${
                  employee.data().commerceId
                }/PushNotificationTokens/${deviceToken}`
              );

              batch.delete(workplacePushNotificationRef);
            });
          }
        });

      batch.commit();
    }
  } catch (error) {
    console.error(error);
  }
};
