import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COURT_RESERVATION_VALUE_CHANGE,
  ON_COURT_RESERVATION_CREATING,
  ON_COURT_RESERVATION_CREATE,
  ON_COURT_RESERVATION_CREATE_FAIL,
  ON_COURT_RESERVATION_CLEAR
} from "./types";

export const onCourtReservationValueChange = ({ prop, value }) => {
  return { type: ON_COURT_RESERVATION_VALUE_CHANGE, payload: { prop, value } };
}

export const onClientCourtReservationCreate = ({ commerceId, courtId, courtType, slot, price, light }) => {
  // using batched writes
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: ON_COURT_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({})
      .then(commerceReservationRef => {
        const reservationDate = new Date();
        const clientReservationRef = db.doc(`Profiles/${currentUser.uid}/Reservations/${commerceReservationRef.id}`);
        const batch = db.batch();

        // reserva que se guarda en el negocio
        batch.set(commerceReservationRef, {
          clientId: currentUser.uid,
          courtId,
          courtType,
          startDate: slot.startDate.toDate(),
          endDate: slot.endDate.toDate(),
          reservationDate,
          cancelationDate: null,
          price,
          light,
          state: null
        });

        // reserva que se guarda en el cliente
        batch.set(clientReservationRef, {
          commerceId,
          courtId,
          courtType,
          startDate: slot.startDate.toDate(),
          endDate: slot.endDate.toDate(),
          reservationDate,
          cancelationDate: null,
          price,
          light,
          state: null
        });

        batch.commit()
          .then(() => dispatch({ type: ON_COURT_RESERVATION_CREATE }))
          .catch(error => {
            db.doc(`Commerces/${commerceId}/Reservations/${commerceReservationRef.id}`).delete();
            dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL });
          });
      })
      .catch(error => dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL }));

    /*
    Aca en los catch en un futuro vamos a tener que considerar los tipos de errores o lanzar una validacion antes
    del guardado para ver si un turno no lo reservo otro mientras uno trataba de reservarlo, control de concurrencia perris
    */
  }
}

export const onCommerceCourtReservationCreate = ({ commerceId, client, court, slot, light, price }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COURT_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({
        clientId: null,
        client,
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
      .then(() => dispatch({ type: ON_COURT_RESERVATION_CREATE }))
      .catch(error => dispatch({ type: ON_COURT_RESERVATION_CREATE_FAIL }));
  }
}