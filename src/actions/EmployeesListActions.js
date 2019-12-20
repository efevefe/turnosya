import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_EMPLOYEES_READ, ON_EMPLOYEES_READING } from './types';

export const readEmployees = commerceId => dispatch => {
  dispatch({ type: ON_EMPLOYEES_READING });

  const db = firebase.firestore();

  db.collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null)
    .onSnapshot(snapshot => {
      let employees = [];
      snapshot.forEach(doc => employees.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_EMPLOYEES_READ, payload: employees });
    });
};
