import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_PAYMENT_READ,
  ON_PAYMENT_READING,
  ON_PAYMENT_READ_FAIL,
  ON_CASH_PAYMENT_REGISTERED,
  ON_CASH_PAYMENT_REGISTERING,
  ON_CASH_PAYMENT_REGISTER_FAIL
} from '../actions/types';

export const onReservationPaymentRead = reservation => dispatch => {
  dispatch({ type: ON_PAYMENT_READING });

  const db = firebase.firestore();
  const { commerceId, paymentId } = reservation;

  db.collection(`Commerces/${commerceId}/Payments`)
    .doc(paymentId)
    .get()
    .then(snapshot => {
      dispatch({ type: ON_PAYMENT_READ, payload: snapshot.data() });
    })
    .catch(() => dispatch({ type: ON_PAYMENT_READ_FAIL }));
};

export const onCashPaymentCreate = (reservation, receiptNumber, navigation) => dispatch => {
  dispatch({ type: ON_CASH_PAYMENT_REGISTERING });

  const db = firebase.firestore();
  const batch = db.batch();
  const { commerceId, clientId, id: reservationId } = reservation;

  const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc();
  batch.set(paymentRef, {
    clientId,
    reservationId,
    receiptNumber,
    date: new Date(),
    method: 'Efectivo'
  });

  const commerceReservationRef = db.collection(`Commerces/${commerceId}/Reservations`).doc(reservationId);
  batch.update(commerceReservationRef, { paymentId: paymentRef.id });

  if (clientId) {
    const clientReservationRef = db.collection(`Profiles/${clientId}/Reservations`).doc(reservationId);
    batch.update(clientReservationRef, { paymentId: paymentRef.id });
  }

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
