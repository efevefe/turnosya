import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE
} from './types';
import moment from 'moment';

export const onCommerceReportValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_REPORT_VALUE_CHANGE, payload: { prop, value } };
};

export const readReservationsOnDays = (
  commerceId,
  startDate,
  endDate
) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const reservations = [];
  const days = [0, 0, 0, 0, 0, 0, 0];

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<', endDate.toDate())
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        reservations.push({
          id: doc.id,
          ...doc.data(),
          startDate: moment(doc.data().startDate.toDate()),
          endDate: moment(doc.data().endDate.toDate())
        });
      });

      reservations.forEach(reservation => {
        if (moment(reservation.startDate).format('dddd') === 'Monday') {
          days.fill(days[0] + 1, 0, 1);
        } else if (moment(reservation.startDate).format('dddd') === 'Tuesday') {
          days.fill(days[1] + 1, 1, 2);
        } else if (
          moment(reservation.startDate).format('dddd') === 'Wednesday'
        ) {
          days.fill(days[2] + 1, 2, 3);
        } else if (
          moment(reservation.startDate).format('dddd') === 'Thursday'
        ) {
          days.fill(days[3] + 1, 3, 4);
        } else if (moment(reservation.startDate).format('dddd') === 'Friday') {
          days.fill(days[4] + 1, 4, 5);
        } else if (
          moment(reservation.startDate).format('dddd') === 'Saturday'
        ) {
          days.fill(days[5] + 1, 5, 6);
        } else if (moment(reservation.startDate).format('dddd') === 'Sunday') {
          days.fill(days[6] + 1, 6, 7);
        }
      });

      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: days
      });
    });
};

export const readEarningsOnMonths = (commerceId, startDate) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
  const reservations = [];
  const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where(
      'startDate',
      '>=',
      moment(startDate)
        .startOf('year')
        .toDate()
    )
    .where(
      'startDate',
      '<=',
      moment(startDate)
        .endOf('year')
        .toDate()
    )
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        reservations.push({
          id: doc.id,
          ...doc.data(),
          startDate: moment(doc.data().startDate.toDate()),
          endDate: moment(doc.data().endDate.toDate())
        });
      });

      reservations.forEach(reservation => {
        if (moment(reservation.startDate).format('MMMM') === 'January') {
          months.fill(months[0] + parseFloat(reservation.price), 0, 1);
        } else if (
          moment(reservation.startDate).format('MMMM') === 'February'
        ) {
          months.fill(months[1] + parseFloat(reservation.price), 1, 2);
        } else if (moment(reservation.startDate).format('MMMM') === 'March') {
          months.fill(months[2] + parseFloat(reservation.price), 2, 3);
        } else if (moment(reservation.startDate).format('MMMM') === 'April') {
          months.fill(months[3] + parseFloat(reservation.price), 3, 4);
        } else if (moment(reservation.startDate).format('MMMM') === 'May') {
          months.fill(months[4] + parseFloat(reservation.price), 4, 5);
        } else if (moment(reservation.startDate).format('MMMM') === 'June') {
          months.fill(months[5] + parseFloat(reservation.price), 5, 6);
        } else if (moment(reservation.startDate).format('MMMM') === 'July') {
          months.fill(months[6] + parseFloat(reservation.price), 6, 7);
        } else if (moment(reservation.startDate).format('MMMM') === 'August') {
          months.fill(months[7] + parseFloat(reservation.price), 7, 8);
        } else if (
          moment(reservation.startDate).format('MMMM') === 'September'
        ) {
          months.fill(months[8] + parseFloat(reservation.price), 8, 9);
        } else if (moment(reservation.startDate).format('MMMM') === 'October') {
          months.fill(months[9] + parseFloat(reservation.price), 9, 10);
        } else if (
          moment(reservation.startDate).format('MMMM') === 'November'
        ) {
          months.fill(months[10] + parseFloat(reservation.price), 10, 11);
        } else if (
          moment(reservation.startDate).format('MMMM') === 'December'
        ) {
          months.fill(months[11] + parseFloat(reservation.price), 11, 12);
        }
      });
      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: months
      });
    });
};

// Review Reports
export const readReviewsOnMonths = (commerceId, startDate) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
  const reviews = [];
  const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const data = [];

  return db
    .collection(`Commerces/${commerceId}/Reviews`)
    .where('softDelete', '==', null)
    .where(
      'date',
      '>=',
      moment(startDate)
        .startOf('year')
        .toDate()
    )
    .where(
      'date',
      '<=',
      moment(startDate)
        .endOf('year')
        .toDate()
    )
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        reviews.push({
          ...doc.data(),
          date: moment(doc.data().date.toDate())
        });
      });

      reviews.forEach(review => {
        if (moment(review.date).format('MMMM') === 'January') {
          months.fill(months[0] + parseFloat(review.rating), 0, 1);
          count.fill(count[0] + 1, 0, 1);
        } else if (moment(review.date).format('MMMM') === 'February') {
          months.fill(months[1] + parseFloat(review.rating), 1, 2);
          count.fill(count[1] + 1, 1, 2);
        } else if (moment(review.date).format('MMMM') === 'March') {
          months.fill(months[2] + parseFloat(review.rating), 2, 3);
          count.fill(count[2] + 1, 2, 3);
        } else if (moment(review.date).format('MMMM') === 'April') {
          months.fill(months[3] + parseFloat(review.rating), 3, 4);
          count.fill(count[3] + 1, 3, 4);
        } else if (moment(review.date).format('MMMM') === 'May') {
          months.fill(months[4] + parseFloat(review.rating), 4, 5);
          count.fill(count[4] + 1, 4, 5);
        } else if (moment(review.date).format('MMMM') === 'June') {
          months.fill(months[5] + parseFloat(review.rating), 5, 6);
          count.fill(count[5] + 1, 5, 6);
        } else if (moment(review.date).format('MMMM') === 'July') {
          months.fill(months[6] + parseFloat(review.rating), 6, 7);
          count.fill(count[6] + 1, 6, 7);
        } else if (moment(review.date).format('MMMM') === 'August') {
          months.fill(months[7] + parseFloat(review.rating), 7, 8);
          count.fill(count[7] + 1, 7, 8);
        } else if (moment(review.date).format('MMMM') === 'September') {
          months.fill(months[8] + parseFloat(review.rating), 8, 9);
          count.fill(count[8] + 1, 8, 9);
        } else if (moment(review.date).format('MMMM') === 'October') {
          months.fill(months[9] + parseFloat(review.rating), 9, 10);
          count.fill(count[9] + 1, 9, 10);
        } else if (moment(review.date).format('MMMM') === 'November') {
          months.fill(months[10] + parseFloat(review.rating), 10, 11);
          count.fill(count[10] + 1, 10, 11);
        } else if (moment(review.date).format('MMMM') === 'December') {
          months.fill(months[11] + parseFloat(review.rating), 11, 12);
          count.fill(count[11] + 1, 11, 12);
        }
      });

      let i = 0;

      months.forEach(month => {
        month !== 0 ? data.push(month / count[i]) : data.push(0);
        i++;
      });
      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: data
      });
    });
};

export const readStateTurnsReservations = (
  commerceId,
  startDate,
  endDate
) => dispatch => {
  // Tengo que revisar esto bien, lo hace mal ya me voy a fijar que onda despues
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
  const reservations = [];
  const turns = [0, 0];
  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<', endDate.toDate())
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        reservations.push({
          id: doc.id,
          ...doc.data(),
          startDate: moment(doc.data().startDate.toDate()),
          endDate: moment(doc.data().endDate.toDate())
        });
      });

      reservations.forEach(reservation => {
        if (reservation.state === null) {
          // Hay que revisar esto despues porq en la BD hay negocios con el
          // campo este como 'cancelationDate' y otros como 'cancellationDate'. Hay que corregir eso en la BD.. Por eso lo hice con el state
          turns.fill(turns[0] + 1, 0, 1);
        } else {
          turns.fill(turns[1] + 1, 1, 2);
        }
      });

      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: turns
      });
    });
};
