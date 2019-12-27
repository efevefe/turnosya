import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_CLIENT_RESERVATIONS_READ,
  ON_CLIENT_RESERVATIONS_READING,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL,
  ON_CLIENT_RESERVATION_CANCELING
} from './types';
import moment from 'moment';
import { sendPushNotification } from '../actions';

export const onClientReservationsListRead = () => dispatch => {
  dispatch({ type: ON_CLIENT_RESERVATIONS_READING });

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return db.collection(`Profiles/${currentUser.uid}/Reservations`)
    .where('state', "==", null)
    .orderBy('startDate')
    .onSnapshot(snapshot => {
      const reservations = [];

      if (snapshot.empty) {
        return dispatch({
          type: ON_CLIENT_RESERVATIONS_READ,
          payload: reservations
        });
      }

      snapshot.forEach(doc => {
        db.doc(`Commerces/${doc.data().commerceId}`)
          .get()
          .then(commerceData => {
            db.doc(`Commerces/${doc.data().commerceId}/Courts/${doc.data().courtId}`)
              .get()
              .then(courtData => {
                reservations.push({
                  ...doc.data(),
                  court: courtData.data(),
                  commerce: commerceData.data(),
                  id: doc.id,
                  startDate: moment(doc.data().startDate.toDate()),
                  endDate: moment(doc.data().endDate.toDate())
                });

                if (snapshot.size === reservations.length) {
                  dispatch({
                    type: ON_CLIENT_RESERVATIONS_READ,
                    payload: reservations.sort((a, b) => a.startDate - b.startDate)
                  });
                }
              });
          });
      });
    });
};

export const onClientCancelReservation = ({
  reservationId,
  commerceId,
  navigation,
  title,
  body,
  token
}) => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  const batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_CLIENT_RESERVATION_CANCELING }),
      db
        .doc(`ReservationStates/canceled`)
        .get()
        .then(stateDoc => {
          const cancelationDate = new Date();
          batch.update(
            db.doc(`Profiles/${currentUser.uid}/Reservations/${reservationId}`),
            {
              state: { id: stateDoc.id, name: stateDoc.data().name },
              cancelationDate
            }
          );
          batch.update(
            db.doc(`Commerces/${commerceId}/Reservations/${reservationId}`),
            {
              state: { id: stateDoc.id, name: stateDoc.data().name },
              cancelationDate
            }
          );

          batch
            .commit()
            .then(() => {
              sendPushNotification(title, body, token);
              dispatch({ type: ON_CLIENT_RESERVATION_CANCEL });
              navigation.goBack();
            })
            .catch(() => {
              dispatch({
                type: ON_CLIENT_RESERVATION_CANCEL_FAIL
              });
            });
        })
        .catch(() => {
          dispatch({
            type: ON_CLIENT_RESERVATION_CANCEL_FAIL
          });
        });
  };
};
