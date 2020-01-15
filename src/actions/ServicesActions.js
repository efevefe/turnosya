import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_SERVICE_VALUE_CHANGE,
  ON_FORM_OPEN,
  SERVICE_CREATE,
  SERVICES_READING,
  SERVICES_READ,
  SERVICE_FORM_SUBMIT,
  SERVICE_DELETE,
  SERVICE_UPDATE
} from './types';

export const onServiceValueChange = ({ prop, value }) => {
  return { type: ON_SERVICE_VALUE_CHANGE, payload: { prop, value } };
};

export const onFormOpen = () => {
  return { type: ON_FORM_OPEN };
};

export const serviceCreate = ({ name, duration, price, description, commerceId, employeesIds }, navigation) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: SERVICE_FORM_SUBMIT });

    db.collection(`Commerces/${commerceId}/Services`)
      .add({ name, duration, price, description, employeesIds, softDelete: null })
      .then(() => {
        dispatch({ type: SERVICE_CREATE });
        navigation.goBack();
      });
  };
};

export const servicesRead = commerceId => dispatch => {
  dispatch({ type: SERVICES_READING });

  const db = firebase.firestore();

  return db.collection(`Commerces/${commerceId}/Services`)
    .where('softDelete', '==', null)
    .orderBy('name', 'asc')
    .onSnapshot(snapshot => {
      const services = [];
      snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: SERVICES_READ, payload: services });
    });
};

export const servicesReadByEmployee = ({ commerceId, employeeId }) => dispatch => {
  dispatch({ type: SERVICES_READING });

  const db = firebase.firestore();

  return db.collection(`Commerces/${commerceId}/Services`)
    .where('softDelete', '==', null)
    .where('employeesIds', 'array-contains', employeeId)
    .orderBy('name', 'asc')
    .onSnapshot(snapshot => {
      const services = [];
      snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: SERVICES_READ, payload: services });
    });
}

export const serviceDelete = ({ id, commerceId }) => {
  const db = firebase.firestore();

  return dispatch => {
    db.doc(`Commerces/${commerceId}/Services/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: SERVICE_DELETE }));
  };
};

export const serviceUpdate = ({ id, name, duration, price, description, employeesIds, commerceId }, navigation = null) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: SERVICE_FORM_SUBMIT });

    db.doc(`Commerces/${commerceId}/Services/${id}`)
      .update({ name, duration, price, description, employeesIds })
      .then(() => {
        dispatch({ type: SERVICE_UPDATE });
        navigation && navigation.goBack();
      });
  };
};

export const offeringServiceUpdate = ({ id, employeesIds, commerceId }) => {
  const db = firebase.firestore();

  db.doc(`Commerces/${commerceId}/Services/${id}`)
    .update({ employeesIds });
};
