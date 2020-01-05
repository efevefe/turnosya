import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE,
  ON_COMMERCE_REPORT_VALUE_RESET,
  ON_COMMERCE_REPORT_DATA_EMPTY
} from './types';
import moment from 'moment';

export const onCommerceReportValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_REPORT_VALUE_CHANGE, payload: { prop, value } };
};

export const onCommerceReportValueReset = () => {
  return { type: ON_COMMERCE_REPORT_VALUE_RESET };
};

// Reservations per day report
export const readReservationsOnDays = (
  commerceId,
  startDate,
  endDate
) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const days = [0, 0, 0, 0, 0, 0, 0]; //7 days

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<', endDate.toDate())
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          const numberOfDay = moment(doc.data().startDate.toDate()).day();
          days[numberOfDay] += 1;
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: days
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

// Earnings report
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
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

export const readEarningsPerMonths = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
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
          const numberOfMonth = moment(doc.data().startDate.toDate()).month();
          months[numberOfMonth] += parseFloat(doc.data().price);
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: months
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

// Review Report
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
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

export const readReviewsPerMonths = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });
  const db = firebase.firestore();
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
          const numberOfMonth = moment(doc.data().date.toDate()).month();
          months[numberOfMonth] += parseFloat(doc.data().rating);
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
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

// State turns reservation report
export const readStateTurnsReservations = (
  commerceId,
  startDate,
  endDate
) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const turns = [0, 0];
  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<', endDate.toDate())
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          const state = doc.data().state;
          state ? (turns[1] += 1) : (turns[0] += 1);

          // TODO: el día de mañana, esto se debería hacer:
          // if (state) turns[state.id] += 1;
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: turns
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};
