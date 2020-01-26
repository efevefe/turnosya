import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REPORT_READING,
  ON_COMMERCE_REPORT_READ,
  ON_COMMERCE_REPORT_VALUE_CHANGE,
  ON_COMMERCE_REPORT_VALUE_RESET,
  ON_COMMERCE_REPORT_DATA_EMPTY,
  ON_COMMERCE_REPORT_DATA_ERROR,
} from './types';
import moment from 'moment';

const arrayOfMonths = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']; // Months of year
const arrayOfDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Days of week

export const onCommerceReportValueChange = payload => {
  return { type: ON_COMMERCE_REPORT_VALUE_CHANGE, payload };
};

export const onCommerceReportValueReset = () => {
  return { type: ON_COMMERCE_REPORT_VALUE_RESET };
};

// Daily Reservations report
export const onDailyReservationsReadByRange = (commerceId, startDate, endDate) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const data = [0, 0, 0, 0, 0, 0, 0]; // 7 days
  const labels = arrayOfDays;

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('state', '==', null)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<=', endDate.toDate())
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          const numberOfDay = moment(doc.data().startDate.toDate()).day();
          data[numberOfDay] += 1;
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: { labels, data },
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

// Monthly Earnings Report
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
        firstYear = moment(querySnapshot.docs[0].data().startDate.toDate()).format('YYYY');

        if (currentYear === firstYear) {
          years.push({
            label: currentYear.toString(),
            value: currentYear.toString(),
          });
        } else {
          for (i = firstYear; i <= currentYear; i++) {
            years.push({ label: i.toString(), value: i.toString() });
          }
        }

        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { years, selectedYear: currentYear },
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

export const onMonthlyEarningsReadByYear = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  if (!year) return dispatch({ type: ON_COMMERCE_REPORT_DATA_ERROR });

  const db = firebase.firestore();
  const months = Array(12).fill(0); // 12 months
  const labels = arrayOfMonths;

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
      }

      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: { labels, data: months },
      });
    });
};

// Monthly Reviews Report
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
        firstYear = moment(querySnapshot.docs[0].data().date.toDate()).format('YYYY');

        if (currentYear === firstYear) {
          years.push({
            label: currentYear.toString(),
            value: currentYear.toString(),
          });
        } else {
          for (i = firstYear; i <= currentYear; i++) {
            years.push({ label: i.toString(), value: i.toString() });
          }
        }

        dispatch({
          type: ON_COMMERCE_REPORT_VALUE_CHANGE,
          payload: { years, selectedYear: currentYear },
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

export const onMonthlyReviewsReadByYear = (commerceId, year) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  if (!year) return dispatch({ type: ON_COMMERCE_REPORT_DATA_ERROR });

  const db = firebase.firestore();
  const months = Array(12).fill(0); // total rating per month
  const counts = Array(12).fill(0); // ratings quantity per month
  const data = Array(12).fill(0); // avg rating per month
  const labels = arrayOfMonths;

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
          counts[numberOfMonth]++;
        });

        months.forEach((month, i) => {
          data[i] = month ? month / counts[i] : 0;
        });
      }

      dispatch({
        type: ON_COMMERCE_REPORT_READ,
        payload: { labels, data },
      });
    });
};

// Reserved and Cancelled Shift Report
export const onReservedAndCancelledShiftReadByRange = (commerceId, startDate, endDate) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const counts = [0, 0]; // [realizados, cancelados]
  const labels = ['Realizados', 'Cancelados'];

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<=', endDate.toDate())
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          const state = doc.data().state ? 1 : 0;
          counts[state]++;

          // TODO: el día de mañana, esto se debería hacer:
          // if (state) counts[state.id] += 1;
        });

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: { labels, data: counts },
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};

// Most Popular Shifts Report
export const onMostPopularShiftsReadByRange = (commerceId, startDate, endDate) => dispatch => {
  dispatch({ type: ON_COMMERCE_REPORT_READING });

  const db = firebase.firestore();
  const shifts = {};

  return db
    .collection(`Commerces/${commerceId}/Reservations`)
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<=', endDate.toDate())
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          const shift = moment(doc.data().startDate.toDate())
            .format('HH:mm')
            .toString();
          shifts[shift] ? (shifts[shift] += 1) : (shifts[shift] = 1);
        });

        let sortedShifts = Object.keys(shifts).sort((a, b) => shifts[b] - shifts[a]);

        let data = [];
        sortedShifts.forEach(val => data.push(shifts[val]));

        if (data.length > 7) {
          data = data.slice(0, 7);
          sortedShifts = sortedShifts.slice(0, 7);
        }

        dispatch({
          type: ON_COMMERCE_REPORT_READ,
          payload: { labels: sortedShifts, data },
        });
      } else {
        dispatch({ type: ON_COMMERCE_REPORT_DATA_EMPTY });
      }
    });
};
