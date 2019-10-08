import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_COMMERCE_COURT_RESERVATIONS_READ,
  ON_COMMERCE_COURT_RESERVATIONS_READING,
  ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL,
  ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
  ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READING,
  ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READ
} from './types';

export const onCourtReservationsListValueChange = ({ prop, value }) => {
  return {
    type: ON_COURT_RESERVATIONS_LIST_VALUE_CHANGE,
    payload: { prop, value }
  };
};

export const onCommerceCourtReservationsRead = ({
  commerceId,
  selectedDate,
  slots,
  courts
}) => {
  const db = firebase.firestore();
  const reservations = [];
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
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          reservations.push({
            id: doc.id,
            ...doc.data(),
            startDate: moment(doc.data().startDate.toDate()),
            endDate: moment(doc.data().endDate.toDate())
          });
        });
      })
      .then(() => {
        if (reservations.length !== 0) {
          for (j in slots) {
            var ocupate = [];

            for (i in reservations) {
              slots[j].startDate.toString() ===
                reservations[i].startDate.toString()
                ? ocupate.push({ value: reservations[i] })
                : null;
            }

            ocupate.length >= courts.length
              ? (slots[j].available = false)
              : (slots[j].available = true);
          }
        }
        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
          payload: reservations
        });
      })

      .catch(error =>
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL })
      );
  };
};

export const onCommerceCourtReservationsReadOnSlot = ({ commerceId, startDate }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('startDate', '==', startDate.toDate())
      .get()
      .then(snapshot => {
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
          type: ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READ,
          payload: reservations
        });
      })
      .catch(error =>
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL })
      );
  };
};

export const onCommerceCourtReservationsListRead = ({ commerceId, selectedDate }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });
    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('startDate', '>=', selectedDate.toDate())
      .where('startDate', '<', moment(selectedDate).add(1, 'days').toDate())
      .orderBy('startDate')
      .onSnapshot(snapshot => {
        var reservations = [];
        var processedItems = 0;

        if (snapshot.empty) {
          dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: [] });
          return;
        }

        snapshot.forEach(doc => {
          db.doc(`Commerces/${commerceId}/Courts/${doc.data().courtId}`)
            .get()
            .then(court => {
              db.doc(`Profiles/${doc.data().clientId}`)
                .get()
                .then(client => {
                  reservations.push({
                    id: doc.id,
                    ...doc.data(),
                    startDate: moment(doc.data().startDate.toDate()),
                    endDate: moment(doc.data().endDate.toDate()),
                    reservationDate: moment(doc.data().reservationDate.toDate()),
                    client: { id: client.id, ...client.data() },
                    court: { id: court.id, ...court.data() }
                  });

                  processedItems++;

                  if (processedItems === snapshot.size) {
                    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: reservations });
                  }
                });
            });
        });
      })
  }
}