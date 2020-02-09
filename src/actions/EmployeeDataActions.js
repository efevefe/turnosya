import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_EMPLOYEE_VALUE_CHANGE,
  ON_EMPLOYEE_VALUES_RESET,
  ON_USER_SEARCHING,
  ON_USER_SEARCH_SUCCESS,
  ON_USER_SEARCH_FAIL,
  ON_EMPLOYEE_SAVING,
  ON_EMPLOYEE_CREATED,
  ON_EMPLOYEE_SAVE_FAIL,
  ON_EMPLOYEE_DELETED,
  ON_EMPLOYEE_UPDATED
} from './types';
import { onClientNotificationSend } from './NotificationActions';
import { onUserWorkplacesRead } from './ClientDataActions';
import { NOTIFICATION_TYPES } from '../constants';

export const onEmployeeValueChange = payload => ({
  type: ON_EMPLOYEE_VALUE_CHANGE,
  payload
});

export const onEmployeeValuesReset = () => ({ type: ON_EMPLOYEE_VALUES_RESET });

export const onEmployeeInvite = (
  { commerceId, commerceName, email, firstName, lastName, phone, role, profileId },
  navigation
) => dispatch => {
  dispatch({ type: ON_EMPLOYEE_SAVING });

  const db = firebase.firestore();

  db.collection(`Commerces/${commerceId}/Employees`)
    .add({
      email,
      phone,
      firstName,
      lastName,
      role,
      softDelete: null,
      inviteDate: new Date(),
      startDate: null,
      profileId
    })
    .then(employeeRef => {
      const notification = {
        title: 'Invitación de Empleo',
        body: `Usted ha sido invitado como empleado del negocio ${commerceName}. Debe aceptar la invitación para formar parte del comercio y trabajar usando la app!`
      };

      onClientNotificationSend(notification, profileId, commerceId, NOTIFICATION_TYPES.EMPLOYMENT_INVITE, {
        employeeId: employeeRef.id
      });

      dispatch({ type: ON_EMPLOYEE_CREATED });
      navigation.goBack();
    })
    .catch(() => dispatch({ type: ON_EMPLOYEE_SAVE_FAIL }));
};

export const onEmployeeCreate = ({ commerceId, employeeId, profileId }) => async dispatch => {
  dispatch({ type: ON_EMPLOYEE_SAVING });

  const db = firebase.firestore();

  const commerce = await db.doc(`Commerces/${commerceId}`).get();

  const batch = db.batch();

  const employeeRef = db.collection(`Commerces/${commerceId}/Employees`).doc(employeeId);
  const workplaceRef = db.collection(`Profiles/${profileId}/Workplaces`).doc();

  batch.update(employeeRef, { startDate: new Date() });

  batch.set(workplaceRef, { commerceId, name: commerce.data().name, softDelete: null });

  batch
    .commit()
    .then(() => {
      dispatch({ type: ON_EMPLOYEE_CREATED });

      if (profileId === firebase.auth().currentUser.uid) onUserWorkplacesRead()(dispatch);
    })
    .catch(() => dispatch({ type: ON_EMPLOYEE_SAVE_FAIL }));
};

export const onEmployeeUpdate = (
  { employeeId, commerceId, firstName, lastName, phone, role },
  navigation
) => dispatch => {
  const db = firebase.firestore();

  dispatch({ type: ON_EMPLOYEE_SAVING });

  db.collection(`Commerces/${commerceId}/Employees`)
    .doc(employeeId)
    .update({ firstName, lastName, phone, role })
    .then(() => {
      dispatch({ type: ON_EMPLOYEE_UPDATED });
      navigation.goBack();
    })
    .catch(() => dispatch({ type: ON_EMPLOYEE_SAVE_FAIL }));
};

export const onEmployeeDelete = ({ employeeId, commerceId, profileId }) => async dispatch => {
  const db = firebase.firestore();

  const snapshot = await db
    .collection(`Profiles/${profileId}/Workplaces`)
    .where('commerceId', '==', commerceId)
    .where('softDelete', '==', null)
    .get();

  if (snapshot.empty) {
    // Empleado fue invitado y todavía no aceptó
    db.collection(`Commerces/${commerceId}/Employees`)
      .doc(employeeId)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_EMPLOYEE_DELETED }));
  } else {
    // Empleado aceptó invitación de trabajo
    const workplaceRef = db.collection(`Profiles/${profileId}/Workplaces`).doc(snapshot.docs[0].id);
    const employeeRef = db.collection(`Commerces/${commerceId}/Employees`).doc(employeeId);

    const batch = db.batch();

    batch.update(workplaceRef, { softDelete: new Date() });
    batch.update(employeeRef, { softDelete: new Date() });

    batch.commit().then(() => dispatch({ type: ON_EMPLOYEE_DELETED }));
  }
};

export const onEmployeeInfoUpdate = email => dispatch => {
  dispatch({ type: ON_USER_SEARCHING });

  searchUserByEmail(email).then(snapshot => {
    if (!snapshot.empty) {
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

export const onUserByEmailSearch = (email, commerceId) => dispatch => {
  dispatch({ type: ON_USER_SEARCHING });

  searchUserByEmail(email).then(snapshot => {
    if (snapshot.empty) {
      dispatch({
        type: ON_USER_SEARCH_FAIL,
        payload: 'No se encontró ningún usuario'
      });
    } else {
      const doc = snapshot.docs[0];

      if (doc.data().commerceId === commerceId)
        dispatch({
          type: ON_USER_SEARCH_FAIL,
          payload: 'El dueño no puede ser empleado'
        });
      else
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

const searchUserByEmail = email => {
  return firebase
    .firestore()
    .collection('Profiles')
    .where('email', '==', email)
    .get();
};
