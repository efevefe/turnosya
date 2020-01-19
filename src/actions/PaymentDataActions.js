import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_PAYMENT_METHOD_READ,
  ON_PAYMENT_METHOD_READING,
  ON_PAYMENT_METHOD_READ_FAIL
} from '../actions/types';

export const readReservationPaymentMethod = reservation => dispatch => {
  dispatch({ type: ON_PAYMENT_METHOD_READING });

  const db = firebase.firestore();
  const { id } = reservation;
  const commerceId = reservation.client
    ? reservation.client.commerceId
    : reservation.commerceId;

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
