import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_PAYMENT_METHOD_READ,
  ON_PAYMENT_METHOD_READING,
  ON_PAYMENT_METHOD_READ_FAIL,
  ON_CASH_PAYMENT_REGISTERED,
  ON_CASH_PAYMENT_REGISTERING,
  ON_CASH_PAYMENT_REGISTER_FAIL
} from '../actions/types';

export const readReservationPaymentMethod = reservation => dispatch => {
  dispatch({ type: ON_PAYMENT_METHOD_READING });

  const db = firebase.firestore();
  const { id, commerceId } = reservation;

  db.collection(`Commerces/${commerceId}/Payments`)
    .where('reservationId', '==', id)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        dispatch({
          type: ON_PAYMENT_METHOD_READ,
          payload: snapshot.docs[0].data().method
        });
      } else {
        dispatch({
          type: ON_PAYMENT_METHOD_READ,
          payload: 'N/A'
        });
      }
    })
    .catch(() => dispatch({ type: ON_PAYMENT_METHOD_READ_FAIL }));
};

export const createCashPayment = (reservation, navigation) => dispatch => {
  dispatch({ type: ON_CASH_PAYMENT_REGISTERING });

  const db = firebase.firestore();

  const { commerceId, clientId, id: reservationId } = reservation;

  console.log(commerceId);
  console.log(clientId);
  console.log(reservationId);

  const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc();
  const commerceReservationRef = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .doc(reservationId);
  const clientReservationRef = db
    .collection(`Profiles/${clientId}/Reservations`)
    .doc(reservationId);

  const batch = db.batch();

  batch.set(paymentRef, {
    clientId,
    reservationId,
    date: new Date(),
    method: 'Efectivo'
  });

  batch.update(commerceReservationRef, { paymentDate: new Date() });
  batch.update(clientReservationRef, { paymentDate: new Date() });

  batch
    .commit()
    .then(() => {
      dispatch({ type: ON_CASH_PAYMENT_REGISTERED });
      navigation.goBack();
    })
    .catch(() => {
      dispatch({ type: ON_CASH_PAYMENT_REGISTER_FAIL });
      navigation.goBack();
    });
};
