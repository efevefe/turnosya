import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_EMPLOYEES_READ, ON_EMPLOYEES_READING, ON_EMPLOYEES_READ_FAIL, ON_EMPLOYEE_SELECT } from './types';

export const onEmployeeSelect = selectedEmployeeId => {
  return { type: ON_EMPLOYEE_SELECT, payload: { selectedEmployeeId } };
}

export const onEmployeesRead = (commerceId, visible = false) => dispatch => {
  dispatch({ type: ON_EMPLOYEES_READING });

  const db = firebase.firestore();
  let query = db
    .collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null);

  if (visible) query = query.where('visible', '==', true);

  return query
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
        if (!doc.data().softDelete && doc.data().visible) employees.push({ ...doc.data(), id: doc.id });

        if (index === employeesIds.length - 1) dispatch({ type: ON_EMPLOYEES_READ, payload: employees });
      })
      .catch(error => dispatch({ type: ON_EMPLOYEES_READ_FAIL }));
  });
};
