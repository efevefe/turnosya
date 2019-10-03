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
  selectedDate
}) => {
  const db = firebase.firestore();
  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('startDate', '>=', selectedDate.toDate())
      .where('startDate', '<', selectedDate.add(1, 'days').toDate())
      .get()
      .then(snapshot => {
        var reservations = [];
        snapshot.forEach(doc => {
          reservations.push({
            id: doc.id,
            startHour: moment(doc.data().startDate.toDate()),
            endHour: moment(doc.data().endDate.toDate()),
            // available: false,
            ...doc.data()
          });
        });
        dispatch({
          type: ON_COMMERCE_COURT_RESERVATIONS_READ,
          payload: reservations
        });
      })
      .catch(error =>
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL })
      );
    selectedDate.add(-1, 'days').toDate();
  };
};

export const onCommerceCourtReservationsReadOnSlot = ({ commerceId, slot }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_ON_SLOT_READING });

    db.collection(`Commerces/${commerceId}/Reservations`)
      .where('startDate', '==', slot.toDate())
      .get()
      .then(snapshot => {
        var reservations = [];
        snapshot.forEach(doc => {
          reservations.push({
            id: doc.id,
            startHour: moment(doc.data().startDate.toDate()),
            endHour: moment(doc.data().endDate.toDate()),
            available: false,
            ...doc.data()
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
