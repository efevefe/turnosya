import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_EMPLOYEE_VALUE_CHANGE,
  ON_EMPLOYEE_CLEAR,
  ON_EMPLOYEE_NAME_CLEAR,
  ON_USER_SEARCHING,
  ON_USER_SEARCH_SUCCESS,
  ON_USER_SEARCH_FAIL,
  ON_EMPLOYEE_SAVING,
  ON_EMPLOYEE_CREATED,
  ON_EMPLOYEE_SAVE_FAIL,
  EMPLOYEE_VALIDATION_ERROR,
  ON_EMPLOYEE_DELETED,
  ON_EMPLOYEE_LOAD,
  ON_EMPLOYEE_UPDATED
} from './types';
import { Toast } from '../components/common';

export const employeeValueChange = (prop, value) => ({
  type: ON_EMPLOYEE_VALUE_CHANGE,
  payload: { prop, value }
});

export const createEmployee = (
  { commerceId, email, firstName, lastName, phone, role, profileId },
  navigation
) => dispatch => {
  dispatch({ type: ON_EMPLOYEE_SAVING });

  const db = firebase.firestore();
  const batch = db.batch();

  const employeeRef = db.collection(`Commerces/${commerceId}/Employees`).doc();
  const workplaceRef = db.collection(`Profiles/${profileId}/Workplaces`).doc();

  batch.set(employeeRef, {
    email,
    phone,
    firstName,
    lastName,
    role,
    softDelete: null,
    inviteDate: new Date(),
    startDate: null,
    profileId
  });

  batch.set(workplaceRef, { commerceId, softDelete: null });

  batch
    .commit()
    .then(() => {
      dispatch({ type: ON_EMPLOYEE_CREATED });
      navigation.goBack();
    })
    .catch(() => dispatch({ type: ON_EMPLOYEE_SAVE_FAIL }));
};

export const updateEmployee = (
  { employeeId, commerceId, email, role },
  navigation
) => dispatch => {
  if (firebase.auth().currentUser.email === email) {
    Toast.show({ text: 'No puede editar su propio rol!' });
  } else {
    const db = firebase.firestore();

    dispatch({ type: ON_EMPLOYEE_SAVING });

    db.collection(`Commerces/${commerceId}/Employees`)
      .doc(employeeId)
      .update({ role })
      .then(() => {
        dispatch({ type: ON_EMPLOYEE_UPDATED });
        navigation.goBack();
      })
      .catch(() => dispatch({ type: ON_EMPLOYEE_SAVE_FAIL }));
  }
};

export const deleteEmployee = ({
  employeeId,
  commerceId,
  profileId,
  email
}) => async dispatch => {
  if (firebase.auth().currentUser.email === email) {
    Toast.show({ text: 'No puede eliminarse usted mismo' });
  } else {
    const db = firebase.firestore();

    const snapshot = await db
      .collection(`Profiles/${profileId}/Workplaces`)
      .where('commerceId', '==', commerceId)
      .get();

    const workplaceRef = db
      .collection(`Profiles/${profileId}/Workplaces`)
      .doc(snapshot.docs[0].id);
    const employeeRef = db
      .collection(`Commerces/${commerceId}/Employees`)
      .doc(employeeId);

    const batch = db.batch();

    batch.update(workplaceRef, { softDelete: new Date() });
    batch.update(employeeRef, { softDelete: new Date() });

    batch.commit().then(() => dispatch({ type: ON_EMPLOYEE_DELETED }));
  }
};

export const searchUserEmail = email => dispatch => {
  dispatch({ type: ON_USER_SEARCHING });
  const db = firebase.firestore();

  // VERIFICAR QUE EL DUEÑO NO SE PUEDE AGREGAR

  db.collection('Profiles')
    .where('email', '==', email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        dispatch({ type: ON_USER_SEARCH_FAIL });
      } else {
        const doc = snapshot.docs[0];
        dispatch({
          type: ON_USER_SEARCH_SUCCESS,
          payload: {
            ...doc.data(),
            profileId: doc.id
          }
        });
      }
    });
};

export const employeeValidationError = errorText => ({
  type: EMPLOYEE_VALIDATION_ERROR,
  payload: errorText
});

export const employeeClear = () => ({ type: ON_EMPLOYEE_CLEAR });

export const employeeNameClear = () => ({ type: ON_EMPLOYEE_NAME_CLEAR });

export const loadEmployee = employee => ({
  type: ON_EMPLOYEE_LOAD,
  payload: employee
});
