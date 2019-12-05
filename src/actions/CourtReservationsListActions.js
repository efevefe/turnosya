import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
  ON_RESERVATION_CLIENT_READING,
  ON_RESERVATION_CLIENT_READ,
  ON_RESERVATION_CLIENT_READ_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_RESERVATION_CANCELING,
  ON_COMMERCE_RESERVATION_CANCELED,
  ON_COMMERCE_RESERVATION_CANCEL_FAIL
} from './types';

export const onCourtReservationsListValueChange = ({ prop, value }) => {
  return {
    type: ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
    payload: { prop, value }
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
        reservations.push({
          id: doc.id,
          ...doc.data(),
          startDate: moment(doc.data().startDate.toDate()),
          endDate: moment(doc.data().endDate.toDate())
        });
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

      snapshot.forEach(doc => {
        reservations.push({
          id: doc.id,
          ...doc.data(),
          startDate: moment(doc.data().startDate.toDate()),
          endDate: moment(doc.data().endDate.toDate())
        });
      });

      dispatch({
        type: ON_COMMERCE_COURT_RESERVATIONS_READ,
        payload: { reservations }
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
                detailedReservations.push({
                  id: doc.id,
                  ...doc.data(),
                  startDate: moment(doc.data().startDate.toDate()),
                  endDate: moment(doc.data().endDate.toDate()),
                  reservationDate: moment(doc.data().reservationDate.toDate()),
                  client: { id: client.id, ...client.data() },
                  court: { id: court.id, ...court.data() }
                });

                if (detailedReservations.length === snapshot.size) {
                  detailedReservations.sort((a, b) => a.startDate - b.startDate);

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
  navigation
}) => {
  const db = firebase.firestore();
  const batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_RESERVATION_CANCELING });

    db.doc(`ReservationStates/canceled`)
      .get()
      .then(stateDoc => {
        const cancelationData = {
          state: {
            id: stateDoc.id,
            name: stateDoc.data().name,
            cancelationReason
          },
          cancelationDate: new Date()
        };
        batch.update(
          db.doc(`Commerces/${commerceId}/Reservations/${reservationId}`),
          cancelationData
        );
        batch.update(
          db.doc(`Profiles/${clientId}/Reservations/${reservationId}`),
          cancelationData
        );

        batch
          .commit()
          .then(() => {
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

export const onReservationClientRead = clientId => async dispatch => {
  dispatch({ type: ON_RESERVATION_CLIENT_READING });

  try {
    const doc = await firebase
      .firestore()
      .doc(`Profiles/${clientId}`)
      .get();

    dispatch({
      type: ON_RESERVATION_CLIENT_READ,
      payload: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    dispatch({ type: ON_RESERVATION_CLIENT_READ_FAIL });
  }
}

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
          return dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: { nextReservations } });
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

        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: { nextReservations } });
      })
      .catch(error => dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL, payload: error }));
  }
}
