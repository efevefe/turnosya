import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COURT_RESERVATION_VALUE_CHANGE,
  ON_COURT_RESERVATION_CREATING,
  ON_COURT_RESERVATION_CREATE,
  ON_COURT_RESERVATION_CREATE_FAIL
} from './types';
import { onCommercePushNotificationSend } from '../actions/NotificationActions';

export const onCourtReservationValueChange = ({ prop, value }) => {
  return { type: ON_COURT_RESERVATION_VALUE_CHANGE, payload: { prop, value } };
};

export const onClientCourtReservationCreate = ({
  commerceId,
  courtId,
  courtType,
  slot,
  price,
  light,
  notification
}) => {
  // using batched writes
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: ON_COURT_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({})
      .then(commerceReservationRef => {
        const clientReservationRef = db.doc(
          `Profiles/${currentUser.uid}/Reservations/${commerceReservationRef.id}`
        );
        const batch = db.batch();

        const reservationData = {
          courtId,
          courtType,
          startDate: slot.startDate.toDate(),
          endDate: slot.endDate.toDate(),
          reservationDate: new Date(),
          cancellationDate: null,
          price,
          light,
          state: null
        };

        // reserva que se guarda en el negocio
        batch.set(commerceReservationRef, {
          ...reservationData,
          clientId: currentUser.uid
        });

        // reserva que se guarda en el cliente
        batch.set(clientReservationRef, {
          ...reservationData,
          commerceId
        });

        batch
          .commit()
          .then(() => {
            onCommercePushNotificationSend(notification, commerceId);
            dispatch({ type: ON_COURT_RESERVATION_CREATE });
          })
          .catch(error => {
            db.doc(
              `Commerces/${commerceId}/Reservations/${commerceReservationRef.id}`
            ).delete();
            dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL });
          });
      })
      .catch(error => dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL }));
  };
};

export const onCommerceCourtReservationCreate = ({
  commerceId,
  clientName,
  clientPhone,
  court,
  slot,
  light,
  price,
  notification
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COURT_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({
        clientId: null,
        clientName,
        clientPhone,
        courtId: court.id,
        courtType: court.court,
        startDate: slot.startDate.toDate(),
        endDate: slot.endDate.toDate(),
        reservationDate: new Date(),
        cancellationDate: null,
        price,
        light,
        state: null
      })
      .then(() => {
        onCommercePushNotificationSend(notification, commerceId);
        dispatch({ type: ON_COURT_RESERVATION_CREATE });
      })
      .catch(error => dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL }));
  };
};
