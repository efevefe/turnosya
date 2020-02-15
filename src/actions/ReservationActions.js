import firebase from 'firebase/app';
import 'firebase/firestore';
import { onCommerceNotificationSend } from './NotificationActions';
import {
  ON_RESERVATION_VALUE_CHANGE,
  ON_RESERVATION_CREATING,
  ON_RESERVATION_CREATE,
  ON_RESERVATION_CREATE_FAIL,
  ON_NEW_RESERVATION,
  ON_NEW_SERVICE_RESERVATION,
  ON_RESERVATION_EXISTS
} from './types';
import { NOTIFICATION_TYPES } from '../constants';

export const onReservationValueChange = payload => {
  return { type: ON_RESERVATION_VALUE_CHANGE, payload };
};

export const onNewReservation = () => {
  return { type: ON_NEW_RESERVATION };
};

export const onNewServiceReservation = () => {
  return { type: ON_NEW_SERVICE_RESERVATION };
};

export const onClientCourtReservationCreate = ({
  commerceId,
  areaId,
  courtId,
  courtType,
  startDate,
  endDate,
  price,
  light,
  notification
}) => {
  return onClientReservationCreate(
    {
      areaId,
      courtId,
      courtType,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      price,
      light
    },
    commerceId,
    notification
  );
};

export const onClientServiceReservationCreate = ({
  commerceId,
  areaId,
  serviceId,
  employeeId,
  startDate,
  endDate,
  price,
  notification
}) => {
  return onClientReservationCreate(
    {
      areaId,
      serviceId,
      employeeId,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      price
    },
    commerceId,
    notification
  );
};

const reservationExists = async ({ commerceId, employeeId, courtId, startDate, endDate }) => {
  // creo que lo mejor que pude hacerlo teniendo en cuenta las limitaciones de firestore
  // de todas formas traten de no hacer reservas duplicadas xd
  const db = firebase.firestore();

  let query = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('cancellationDate', '==', null)
    .where('endDate', '>', startDate);

  if (employeeId) query = query.where('employeeId', '==', employeeId);

  if (courtId) query = query.where('courtId', '==', courtId);

  try {
    const snapshot = await query.get();

    return snapshot.docs.some(res => res.data().startDate.toDate() < endDate);
  } catch (error) {
    throw new Error(error);
  }
};

const onClientReservationCreate = (reservationObject, commerceId, notification) => async dispatch => {
  dispatch({ type: ON_RESERVATION_CREATING });

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  const batch = db.batch();

  const commerceReservationRef = db.collection(`Commerces/${commerceId}/Reservations`).doc();
  const clientReservationRef = db.doc(`Profiles/${currentUser.uid}/Reservations/${commerceReservationRef.id}`);

  try {
    const stateDoc = await db.doc(`ReservationStates/reserved`).get();

    const reservationData = {
      ...reservationObject,
      reservationDate: new Date(),
      cancellationDate: null,
      state: { id: stateDoc.id, name: stateDoc.data().name }
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

    const { employeeId, courtId, startDate, endDate } = reservationData;

    if (
      await reservationExists({
        commerceId,
        employeeId,
        courtId,
        startDate,
        endDate
      })
    ) {
      return dispatch({ type: ON_RESERVATION_EXISTS });
    }

    await batch.commit();

    onCommerceNotificationSend(notification, commerceId, employeeId, currentUser.uid, NOTIFICATION_TYPES.NOTIFICATION);

    dispatch({ type: ON_RESERVATION_CREATE });
  } catch (error) {
    console.error(error);
    dispatch({ type: ON_RESERVATION_CREATE_FAIL });
  }
};

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
}) => async dispatch => {
  dispatch({ type: ON_RESERVATION_CREATING });

  const db = firebase.firestore();

  try {
    const stateDoc = await db.doc(`ReservationStates/reserved`).get();

    if (
      await reservationExists({
        commerceId,
        courtId,
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
      })
    ) {
      return dispatch({ type: ON_RESERVATION_EXISTS });
    }

    await db.collection(`Commerces/${commerceId}/Reservations`).add({
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
      state: { id: stateDoc.id, name: stateDoc.data().name }
    });

    dispatch({ type: ON_RESERVATION_CREATE });
  } catch (error) {
    dispatch({ type: ON_RESERVATION_CREATE_FAIL });
  }
};

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
}) => async dispatch => {
  dispatch({ type: ON_RESERVATION_CREATING });

  const db = firebase.firestore();

  try {
    const stateDoc = await db.doc(`ReservationStates/reserved`).get();

    if (
      await reservationExists({
        commerceId,
        employeeId,
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
      })
    ) {
      return dispatch({ type: ON_RESERVATION_EXISTS });
    }

    await db.collection(`Commerces/${commerceId}/Reservations`).add({
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
      state: { id: stateDoc.id, name: stateDoc.data().name }
    });

    dispatch({ type: ON_RESERVATION_CREATE });
  } catch (error) {
    dispatch({ type: ON_RESERVATION_CREATE_FAIL });
  }
};
