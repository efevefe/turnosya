import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_RESERVATION_VALUE_CHANGE,
  ON_RESERVATION_CREATING,
  ON_RESERVATION_CREATE,
  ON_RESERVATION_CREATE_FAIL,
  ON_NEW_RESERVATION,
  ON_NEW_SERVICE_RESERVATION
} from "./types";

export const onReservationValueChange = payload => {
  return { type: ON_RESERVATION_VALUE_CHANGE, payload };
}

export const onNewReservation = () => {
  return { type: ON_NEW_RESERVATION };
}

export const onNewServiceReservation = () => {
  return { type: ON_NEW_SERVICE_RESERVATION };
}

export const onClientCourtReservationCreate = ({ commerceId, areaId, courtId, courtType, startDate, endDate, price, light }) => {
  return onClientReservationCreate({
    areaId,
    courtId,
    courtType,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    price,
    light
  }, commerceId);
}

export const onClientServiceReservationCreate = ({ commerceId, areaId, serviceId, employeeId, startDate, endDate, price }) => {
  return onClientReservationCreate({
    areaId,
    serviceId,
    employeeId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    price
  }, commerceId);
}

const onClientReservationCreate = (reservationObject, commerceId) => {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: ON_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({})
      .then(commerceReservationRef => {
        const clientReservationRef = db.doc(`Profiles/${currentUser.uid}/Reservations/${commerceReservationRef.id}`);
        const batch = db.batch();

        const reservationData = {
          ...reservationObject,
          reservationDate: new Date(),
          cancellationDate: null,
          state: null
        }

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

        batch.commit()
          .then(() => dispatch({ type: ON_RESERVATION_CREATE }))
          .catch(error => {
            db.doc(`Commerces/${commerceId}/Reservations/${commerceReservationRef.id}`).delete();
            dispatch({ type: ON_RESERVATION_CREATE_FAIL });
          });
      })
      .catch(error => dispatch({ type: ON_RESERVATION_CREATE_FAIL }));
  }
}

export const onCommerceCourtReservationCreate = ({
  commerceId,
  areaId,
  courtId,
  courtType,
  clientName,
  clientPhone,
  startDate,
  endDate,
  light,
  price
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({
        areaId,
        clientId: null,
        courtId,
        courtType,
        clientName,
        clientPhone,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        reservationDate: new Date(),
        cancellationDate: null,
        price,
        light,
        state: null
      })
      .then(() => dispatch({ type: ON_RESERVATION_CREATE }))
      .catch(error => dispatch({ type: ON_RESERVATION_CREATE_FAIL }));
  }
}

export const onCommerceServiceReservationCreate = ({
  areaId,
  commerceId,
  serviceId,
  employeeId,
  clientName,
  clientPhone,
  startDate,
  endDate,
  price
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_RESERVATION_CREATING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .add({
        areaId,
        serviceId,
        employeeId,
        clientId: null,
        clientName,
        clientPhone,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        reservationDate: new Date(),
        cancellationDate: null,
        price,
        state: null
      })
      .then(() => dispatch({ type: ON_RESERVATION_CREATE }))
      .catch(error => dispatch({ type: ON_RESERVATION_CREATE_FAIL }));
  }
}