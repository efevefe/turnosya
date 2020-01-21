import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_RESERVATION_CANCELING,
  ON_COMMERCE_RESERVATION_CANCELED,
  ON_COMMERCE_RESERVATION_CANCEL_FAIL
} from './types';
import { onClientNotificationSend } from './PushNotificationActions';

export const onCourtReservationsListValueChange = ({ prop, value }) => {
  return {
    type: ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
    payload: { prop, value }
  };
};

const formatReservation = ({ res, court, client }) => {
  return {
    id: res.id,
    ...res.data(),
    startDate: moment(res.data().startDate.toDate()),
    endDate: moment(res.data().endDate.toDate()),
    reservationDate: moment(res.data().reservationDate.toDate()),
    client: client ? { id: client.id, ...client.data() } : null,
    court: court ? { id: court.id, ...court.data() } : null
  };
};

export const onCommerceCourtTypeReservationsRead = ({
  commerceId,
  selectedDate,
  courtType
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('courtType', '==', courtType)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    )
    .onSnapshot(snapshot => {
      const reservations = [];

      snapshot.forEach(doc => {
        reservations.push(formatReservation({ res: doc }));
      });

      dispatch({
        type: ON_COMMERCE_COURT_RESERVATIONS_READ,
        payload: { reservations }
      });
    });
};

export const onCommerceCourtReservationsRead = ({
  commerceId,
  selectedDate
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    )
    .onSnapshot(snapshot => {
      const reservations = [];

      if (snapshot.empty) {
        return dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
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
                type: ON_COMMERCE_COURT_RESERVATIONS_READ,
                payload: { reservations }
              });
            }
          });
      });
    });
};

export const onCommerceDetailedCourtReservationsRead = ({
  commerceId,
  selectedDate
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('startDate', '>=', selectedDate.toDate())
    .where(
      'startDate',
      '<',
      moment(selectedDate)
        .add(1, 'days')
        .toDate()
    )
    .orderBy('startDate')
    .onSnapshot(snapshot => {
      const detailedReservations = [];

      if (snapshot.empty) {
        return dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
          payload: { detailedReservations }
        });
      }

      snapshot.forEach(doc => {
        db.doc(`Commerces/${commerceId}/Courts/${doc.data().courtId}`)
          .get()
          .then(court => {
            db.doc(`Profiles/${doc.data().clientId}`)
              .get()
              .then(client => {
                detailedReservations.push(
                  formatReservation({
                    res: doc,
                    court,
                    client: client.exists && client
                  })
                );

                if (detailedReservations.length === snapshot.size) {
                  detailedReservations.sort(
                    (a, b) => a.startDate - b.startDate
                  );

                  dispatch({
                    type: ON_COMMERCE_COURT_RESERVATIONS_READ,
                    payload: { detailedReservations }
                  });
                }
              });
          });
      });
    });
};

export const onCommerceCancelReservation = ({
  commerceId,
  reservationId,
  clientId,
  cancelationReason,
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
            cancelationReason
          },
          cancellationDate: new Date()
        };

        batch.update(
          db.doc(`Commerces/${commerceId}/Reservations/${reservationId}`),
          cancellationData
        );

        if (clientId) {
          batch.update(
            db.doc(`Profiles/${clientId}/Reservations/${reservationId}`),
            cancellationData
          );
        }

        batch
          .commit()
          .then(() => {
            onClientNotificationSend(notification, clientId);
            dispatch({ type: ON_COMMERCE_RESERVATION_CANCELED });
            navigation.goBack();
          })
          .catch(e => {
            dispatch({
              type: ON_COMMERCE_RESERVATION_CANCEL_FAIL
            });
          });
      })
      .catch(e => {
        dispatch({
          type: ON_COMMERCE_RESERVATION_CANCEL_FAIL
        });
      });
  };
};

export const onNextReservationsRead = ({ commerceId, startDate, endDate }) => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('state', '==', null)
      .where('startDate', '>=', startDate.toDate())
      .orderBy('startDate')
      .get()
      .then(snapshot => {
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

        const nextReservations = [];

        if (snapshot.empty) {
          return dispatch({
            type: ON_COMMERCE_COURT_RESERVATIONS_READ,
            payload: { nextReservations }
          });
        }

        snapshot.forEach(doc => {
          if (
            !endDate ||
            (endDate && endDate >= moment(doc.data().startDate.toDate()))
          )
            nextReservations.push({
              id: doc.id,
              clientId: doc.data().clientId,
              startDate: moment(doc.data().startDate.toDate()),
              endDate: moment(doc.data().endDate.toDate())
            });
        });

        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
          payload: { nextReservations }
        });
      })
      .catch(error =>
        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
          payload: error
        })
      );
  };
};

export const onCourtNextReservationsRead = ({
  commerceId,
  courtId,
  startDate,
  endDate
}) => {
  // revisar el de arriba
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('courtId', '==', courtId)
      .where('state', '==', null)
      .where('endDate', '>', startDate.toDate())
      .orderBy('endDate')
      .get()
      .then(snapshot => {
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

        const nextReservations = [];

        if (snapshot.empty) {
          return dispatch({
            type: ON_COMMERCE_COURT_RESERVATIONS_READ,
            payload: { nextReservations }
          });
        }

        snapshot.forEach(doc => {
          if (
            !endDate ||
            (endDate && endDate > moment(doc.data().startDate.toDate()))
          )
            nextReservations.push({
              id: doc.id,
              clientId: doc.data().clientId,
              startDate: moment(doc.data().startDate.toDate()),
              endDate: moment(doc.data().endDate.toDate())
            });
        });

        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
          payload: { nextReservations }
        });
      })
      .catch(error =>
        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
          payload: error
        })
      );
  };
};

export const onReservationsCancel = async (
  db,
  batch,
  commerceId,
  reservations
) => {
  // reservations cancel
  try {
    const state = await db.doc(`ReservationStates/canceled`).get();
    const updateObj = {
      cancellationDate: new Date(),
      state: { id: state.id, name: state.data().name }
    };

    reservations.forEach(res => {
      const commerceResRef = db.doc(
        `Commerces/${commerceId}/Reservations/${res.id}`
      );
      const clientResRef = db.doc(
        `Profiles/${res.clientId}/Reservations/${res.id}`
      );
      batch.update(commerceResRef, updateObj);
      batch.update(clientResRef, updateObj);
    });
  } catch (error) {
    console.error(error);
  }
};

export const cancellationDateScript = async () => {
  // script para corregir el nombre del campo cancellationDate en la reserva
  // cuando este publicada la version corregida, lo ejecutamos de nuevo por las
  // dudas y despues lo borramos
  const db = firebase.firestore();

  try {
    const commercesSnapshot = await db
      .collection('Commerces')
      .where('softDelete', '==', null)
      .get();
    if (commercesSnapshot.empty) return;

    commercesSnapshot.forEach(async commerce => {
      const reservationsSnapshot = await db
        .collection(`Commerces/${commerce.id}/Reservations`)
        .get();

      if (!reservationsSnapshot.empty) {
        // batch instance
        const batch = db.batch();

        reservationsSnapshot.forEach(reservation => {
          // updating reservation in commerce
          const {
            cancelationDate,
            cancellationDate,
            clientId
          } = reservation.data();
          let newCancellationDate = null;

          if (cancelationDate) {
            newCancellationDate = cancelationDate;
          } else if (cancellationDate) {
            newCancellationDate = cancellationDate;
          }

          const updateObject = {
            cancellationDate: newCancellationDate,
            cancelationDate: firebase.firestore.FieldValue.delete()
          };

          batch.update(reservation.ref, updateObject);

          // updating reservation in client
          if (clientId) {
            const clientReservationRef = db.doc(
              `Profiles/${clientId}/Reservations/${reservation.id}`
            );
            batch.update(clientReservationRef, updateObject);
          }
        });

        await batch.commit();
        console.log(`${commerce.data().name} --> success`);
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};
