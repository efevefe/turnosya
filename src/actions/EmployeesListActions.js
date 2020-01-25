import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_EMPLOYEES_READ, ON_EMPLOYEES_READING, ON_EMPLOYEES_READ_FAIL } from './types';

export const onEmployeesRead = commerceId => dispatch => {
  dispatch({ type: ON_EMPLOYEES_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null)
    .onSnapshot(snapshot => {
      let employees = [];
      snapshot.forEach(doc => employees.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_EMPLOYEES_READ, payload: employees });
    });
};

export const onEmployeesByIdRead = ({ commerceId, employeesIds }) => dispatch => {
  dispatch({ type: ON_EMPLOYEES_READING });

  const db = firebase.firestore();
  const employees = [];

  employeesIds.forEach((employeeId, index) => {
    db.doc(`Commerces/${commerceId}/Employees/${employeeId}`)
      .get()
      .then(doc => {
        if (!doc.data().softDelete)
          employees.push({ ...doc.data(), id: doc.id });

        if (index === (employeesIds.length - 1))
          dispatch({ type: ON_EMPLOYEES_READ, payload: employees });
      })
      .catch(error => dispatch({ type: ON_EMPLOYEES_READ_FAIL }));
  });
};
