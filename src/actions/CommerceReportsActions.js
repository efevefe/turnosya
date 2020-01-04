import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE,
  ON_COMMERCE_REPORT_VALUE_RESET
} from './types';
import moment from 'moment';

export const onCommerceReportValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_REPORT_VALUE_CHANGE, payload: { prop, value } };
};

export const onCommerceReportValueReset = () => {
  return { type: ON_COMMERCE_REPORT_VALUE_RESET };
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

// Earnings reports
export const yearsOfActivity = commerceId => dispatch => {
  const db = firebase.firestore();

  const years = [];
  let firstYear;
  const currentYear = moment().format('YYYY');

  db.collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null) // TODO: state should be something that is already paid
    .orderBy('startDate', 'asc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      if (!querySnapshot.empty) {
        firstYear = moment(
          querySnapshot.docs[0].data().startDate.toDate()
        ).format('YYYY');

        if (currentYear === firstYear) {
          years.push({
            label: currentYear.toString(),
            value: currentYear.toString()
          });
        } else {
          for (i = firstYear; i <= currentYear; i++) {
            years.push({ label: i.toString(), value: i.toString() });
          }
        }

        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { prop: 'years', value: years }
        });
        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { prop: 'selectedYear', value: currentYear }
        });
      }
    });
};

export const readEarningsPerMonths = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
  const reservations = [];
  const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 months

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null) // TODO: state should be something that is already paid
    .where(
      'startDate', // should be from 'startDate' or 'endDate' ??
      '>=',
      moment(year, 'YYYY')
        .startOf('year')
        .toDate()
    )
    .where(
      'startDate',
      '<=',
      moment(year, 'YYYY')
        .endOf('year')
        .toDate()
    )
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          reservations.push({
            id: doc.id,
            ...doc.data(),
            startDate: moment(doc.data().startDate.toDate()),
            endDate: moment(doc.data().endDate.toDate())
          });
        });

        reservations.forEach(reservation => {
          const numberOfMonth = moment(reservation.startDate).month();

          months[numberOfMonth] += parseFloat(reservation.price);
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: months
        });
      }
    });
};

// Review Reports
export const yearsWithReview = commerceId => dispatch => {
  const db = firebase.firestore();

  const years = [];
  let firstYear;
  const currentYear = moment().format('YYYY');

  db.collection(`Commerces/${commerceId}/Reviews`)
    .where('softDelete', '==', null)
    .orderBy('date', 'asc')
    .limit(1)
    .get()
    .then(querySnapshot => {
      if (!querySnapshot.empty) {
        firstYear = moment(querySnapshot.docs[0].data().date.toDate()).format(
          'YYYY'
        );

        if (currentYear === firstYear) {
          years.push({
            label: currentYear.toString(),
            value: currentYear.toString()
          });
        } else {
          for (i = firstYear; i <= currentYear; i++) {
            years.push({ label: i.toString(), value: i.toString() });
          }
        }

        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { prop: 'years', value: years }
        });
        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { prop: 'selectedYear', value: currentYear }
        });
      }
    });
};

export const readReviewsPerMonths = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
  const reviews = [];
  const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 months
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 count/month
  const data = [];

  return db
    .collection(`Commerces/${commerceId}/Reviews`)
    .where('softDelete', '==', null)
    .where(
      'date',
      '>=',
      moment(year, 'YYYY')
        .startOf('year')
        .toDate()
    )
    .where(
      'date',
      '<=',
      moment(year, 'YYYY')
        .endOf('year')
        .toDate()
    )
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          reviews.push({
            ...doc.data(),
            date: moment(doc.data().date.toDate())
          });
        });

        reviews.forEach(review => {
          const numberOfMonth = moment(review.date).month();

          months[numberOfMonth] += parseFloat(review.rating);
          counts[numberOfMonth] += 1;
        });

        let i = 0;
        months.forEach(month => {
          month !== 0 ? data.push(month / counts[i]) : data.push(0);
          i++;
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: data
        });
      }
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
