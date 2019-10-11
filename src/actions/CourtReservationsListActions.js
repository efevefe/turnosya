import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_RESERVATION_CLIENT_READING,
  ON_RESERVATION_CLIENT_READ,
  ON_RESERVATION_CLIENT_READ_FAIL
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
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

    db.collection(`Commerces/${commerceId}/Reservations`)
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
        var reservations = [];

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
};

export const onCommerceCourtReservationsRead = ({
  commerceId,
  selectedDate
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('startDate', '>=', selectedDate.toDate())
      .where(
        'startDate',
        '<',
        moment(selectedDate)
          .add(1, 'days')
          .toDate()
      )
      .onSnapshot(snapshot => {
        var reservations = [];

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
};

export const onCommerceCourtReservationsDetailedRead = ({
  commerceId,
  selectedDate
}) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });
    db.collection(`Commerces/${commerceId}/Reservations`)
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
        var reservationsDetailed = [];

        if (snapshot.empty) {
          dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: { reservationsDetailed } });
          return;
        }

        snapshot.forEach(doc => {
          db.doc(`Commerces/${commerceId}/Courts/${doc.data().courtId}`)
            .get()
            .then(court => {
              db.doc(`Profiles/${doc.data().clientId}`)
                .get()
                .then(client => {
                  reservationsDetailed.push({
                    id: doc.id,
                    ...doc.data(),
                    startDate: moment(doc.data().startDate.toDate()),
                    endDate: moment(doc.data().endDate.toDate()),
                    reservationDate: moment(
                      doc.data().reservationDate.toDate()
                    ),
                    client: { id: client.id, ...client.data() },
                    court: { id: court.id, ...court.data() }
                  });

                  if (reservationsDetailed.length === snapshot.size) {
                    dispatch({
                      type: ON_COMMERCE_COURT_RESERVATIONS_READ,
                      payload: { reservationsDetailed }
                    });
                  }
                });
            });
        });
      });
  };
};

export const onReservationClientRead = clientId => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_RESERVATION_CLIENT_READING });

    db.doc(`Profiles/${clientId}`)
      .get()
      .then(doc => {
        dispatch({ type: ON_RESERVATION_CLIENT_READ, payload: { id: doc.id, ...doc.data() } });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_RESERVATION_CLIENT_READ_FAIL })
      });
  }
}
