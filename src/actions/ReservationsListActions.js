import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_COMMERCE_RESERVATIONS_READ,
  ON_COMMERCE_RESERVATIONS_READING,
  ON_COMMERCE_RESERVATIONS_READ_FAIL,
  ON_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_RESERVATION_CANCELING,
  ON_COMMERCE_RESERVATION_CANCELED,
  ON_COMMERCE_RESERVATION_CANCEL_FAIL
} from './types';
import { onClientNotificationSend } from './NotificationActions';
import { NOTIFICATION_TYPES } from '../constants';

export const onReservationsListValueChange = payload => {
  return {
    type: ON_RESERVATIONS_LIST_VALUE_CHANGE,
    payload
  };
};

export const formatReservation = ({ res, court, client, commerce, employee, service }) => {
  return {
    id: res.id,
    ...res.data(),
    startDate: moment(res.data().startDate.toDate()),
    endDate: moment(res.data().endDate.toDate()),
    reservationDate: moment(res.data().reservationDate.toDate()),
    client: client ? { id: client.id, ...client.data() } : null,
    court: court ? { id: court.id, ...court.data() } : null,
    employee: employee ? { id: employee.id, ...employee.data() } : null,
    service: service ? { id: service.id, ...service.data() } : null,
    commerce: commerce ? { id: commerce.id, ...commerce.data() } : null
  };
};

export const onClientCommerceReservationsRead = ({ commerceId, selectedDate, employeeId, courtType }) => dispatch => {
  dispatch({ type: ON_COMMERCE_RESERVATIONS_READING });

  const db = firebase.firestore();

  let query = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('cancellationDate', '==', null)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    );

  if (employeeId) query = query.where('employeeId', '==', employeeId);

  if (courtType) query = query.where('courtType', '==', courtType);

  return query.onSnapshot(snapshot => {
    const reservations = [];

    snapshot.forEach(doc => {
      reservations.push(formatReservation({ res: doc }));
    });

    dispatch({
      type: ON_COMMERCE_RESERVATIONS_READ,
      payload: { reservations }
    });
  });
};

export const onCommerceReservationsRead = ({ commerceId, selectedDate, employeeId }) => dispatch => {
  dispatch({ type: ON_COMMERCE_RESERVATIONS_READING });

  const db = firebase.firestore();

  let query = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('cancellationDate', '==', null)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    );

  if (employeeId) query = query.where('employeeId', '==', employeeId);

  return query.onSnapshot(snapshot => {
    const reservations = [];

    if (snapshot.empty) {
      return dispatch({
        type: ON_COMMERCE_RESERVATIONS_READ,
        payload: { reservations }
      });
    }

    snapshot.forEach(doc => {
      db.doc(`Profiles/${doc.data().clientId}`)
        .get()
        .then(client => {
          reservations.push(
            formatReservation({
              res: doc,
              client: client.exists && client
            })
          );

          if (reservations.length === snapshot.size) {
            dispatch({
              type: ON_COMMERCE_RESERVATIONS_READ,
              payload: { reservations }
            });
          }
        });
    });
  });
};

export const onCommerceDetailedReservationsRead = ({ commerceId, selectedDate, employeeId }) => dispatch => {
  dispatch({ type: ON_COMMERCE_RESERVATIONS_READING });

  const db = firebase.firestore();

  let query = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('cancellationDate', '==', null)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    );

  if (employeeId) query = query.where('employeeId', '==', employeeId);

  return query.orderBy('startDate').onSnapshot(snapshot => {
    const detailedReservations = [];

    if (snapshot.empty) {
      return dispatch({
        type: ON_COMMERCE_RESERVATIONS_READ,
        payload: { detailedReservations }
      });
    }

    snapshot.forEach(doc => {
      db.doc(`Profiles/${doc.data().clientId}`)
        .get()
        .then(client => {
          detailedReservations.push(
            formatReservation({
              res: doc,
              client: client.exists && client
            })
          );

          if (detailedReservations.length === snapshot.size) {
            detailedReservations.sort((a, b) => a.startDate - b.startDate);

            dispatch({
              type: ON_COMMERCE_RESERVATIONS_READ,
              payload: { detailedReservations }
            });
          }
        });
    });
  });
};

export const onCommercePaymentRefund = ({ commerceId, mPagoToken, paymentId }) => async () => {
  const db = firebase.firestore();

  const doc = await db.doc(`Commerces/${commerceId}/Payments/${paymentId}`).get();

  if (doc.data().method !== 'Efectivo')
    fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds?access_token=${mPagoToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200 || res.status === 201) {
        db.doc(`Commerces/${commerceId}/Payments/${paymentId}`).update({ refundDate: new Date() });
      }
    });
};

export const onCommerceReservationCancel = ({
  commerceId,
  reservationId,
  clientId,
  cancellationReason,
  navigation,
  notification
}) => {
  const db = firebase.firestore();
  const batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_RESERVATION_CANCELING });

    db.doc(`ReservationStates/canceled`)
      .get()
      .then(stateDoc => {
        const cancellationData = {
          state: {
            id: stateDoc.id,
            name: stateDoc.data().name,
            cancellationReason
          },
          cancellationDate: new Date()
        };

        batch.update(db.doc(`Commerces/${commerceId}/Reservations/${reservationId}`), cancellationData);

        if (clientId) {
          batch.update(db.doc(`Profiles/${clientId}/Reservations/${reservationId}`), cancellationData);
        }

        batch
          .commit()
          .then(() => {
            notification &&
              onClientNotificationSend(notification, clientId, commerceId, NOTIFICATION_TYPES.NOTIFICATION);
            dispatch({ type: ON_COMMERCE_RESERVATION_CANCELED });
            navigation.goBack();
          })
          .catch(error => {
            dispatch({
              type: ON_COMMERCE_RESERVATION_CANCEL_FAIL
            });
          });
      })
      .catch(error => {
        dispatch({
          type: ON_COMMERCE_RESERVATION_CANCEL_FAIL
        });
      });
  };
};

export const onNextReservationsRead = ({ commerceId, startDate, endDate, employeeId }) => {
  const db = firebase.firestore();

  return dispatch => {
    let query = db
      .collection(`Commerces/${commerceId}/Reservations`)
      .where('cancellationDate', '==', null)
      .where('startDate', '>=', startDate.toDate());

    if (employeeId) query = query.where('employeeId', '==', employeeId);

    query
      .orderBy('startDate')
      .get()
      .then(snapshot => {
        dispatch({ type: ON_COMMERCE_RESERVATIONS_READING });

        const nextReservations = [];

        if (snapshot.empty) {
          return dispatch({
            type: ON_COMMERCE_RESERVATIONS_READ,
            payload: { nextReservations }
          });
        }

        snapshot.forEach(doc => {
          if (!endDate || (endDate && endDate >= moment(doc.data().startDate.toDate())))
            nextReservations.push({
              id: doc.id,
              clientId: doc.data().clientId,
              startDate: moment(doc.data().startDate.toDate()),
              endDate: moment(doc.data().endDate.toDate())
            });
        });

        dispatch({
          type: ON_COMMERCE_RESERVATIONS_READ,
          payload: { nextReservations }
        });
      })
      .catch(error => dispatch({ type: ON_COMMERCE_RESERVATIONS_READ_FAIL, payload: error }));
  };
};

export const onCourtNextReservationsRead = ({ commerceId, courtId, startDate, endDate }) => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('courtId', '==', courtId)
      .where('cancellationDate', '==', null)
      .where('endDate', '>', startDate.toDate())
      .orderBy('endDate')
      .get()
      .then(snapshot => {
        dispatch({ type: ON_COMMERCE_RESERVATIONS_READING });

        const nextReservations = [];

        if (snapshot.empty) {
          return dispatch({
            type: ON_COMMERCE_RESERVATIONS_READ,
            payload: { nextReservations }
          });
        }

        snapshot.forEach(doc => {
          if (!endDate || (endDate && endDate > moment(doc.data().startDate.toDate())))
            nextReservations.push({
              id: doc.id,
              clientId: doc.data().clientId,
              startDate: moment(doc.data().startDate.toDate()),
              endDate: moment(doc.data().endDate.toDate())
            });
        });

        dispatch({
          type: ON_COMMERCE_RESERVATIONS_READ,
          payload: { nextReservations }
        });
      })
      .catch(error => dispatch({ type: ON_COMMERCE_RESERVATIONS_READ_FAIL, payload: error }));
  };
};

export const onReservationsCancel = async (db, batch, commerceId, reservations) => {
  // reservations cancel
  if (reservations.length) {
    try {
      const state = await db.doc(`ReservationStates/canceled`).get();
      const updateObj = {
        cancellationDate: new Date(),
        state: { id: state.id, name: state.data().name }
      };

      reservations.forEach(res => {
        const commerceResRef = db.doc(`Commerces/${commerceId}/Reservations/${res.id}`);
        const clientResRef = db.doc(`Profiles/${res.clientId}/Reservations/${res.id}`);
        batch.update(commerceResRef, updateObj);
        batch.update(clientResRef, updateObj);
      });
    } catch (error) {
      console.error(error);
    }
  }
};
