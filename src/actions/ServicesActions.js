import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_SERVICE_VALUE_CHANGE,
  ON_FORM_OPEN,
  ON_SERVICE_CREATE,
  ON_SERVICES_READING,
  ON_SERVICES_READ,
  ON_SERVICE_FORM_SUBMIT,
  ON_SERVICE_DELETE,
  ON_SERVICE_UPDATE,
  ON_SERVICE_EXISTS
} from './types';

export const onServiceValueChange = payload => {
  return { type: ON_SERVICE_VALUE_CHANGE, payload };
};

export const onFormOpen = () => {
  return { type: ON_FORM_OPEN };
};

export const onServiceCreate = ({ name, duration, price, description, commerceId, employeesIds }, navigation) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SERVICE_FORM_SUBMIT });

    db.collection(`Commerces/${commerceId}/Services`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          dispatch({ type: ON_SERVICE_EXISTS });
        } else {
          db.collection(`Commerces/${commerceId}/Services`)
            .add({ name, duration, price, description, employeesIds, softDelete: null })
            .then(() => {
              dispatch({ type: ON_SERVICE_CREATE });
              navigation.goBack();
            });
        }
      });
  };
};

export const onServicesRead = commerceId => dispatch => {
  dispatch({ type: ON_SERVICES_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Services`)
    .where('softDelete', '==', null)
    .orderBy('name', 'asc')
    .onSnapshot(snapshot => {
      const services = [];
      snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_SERVICES_READ, payload: services });
    });
};

export const onServicesByEmployeeRead = ({ commerceId, employeeId }) => dispatch => {
  dispatch({ type: ON_SERVICES_READING });

  const db = firebase.firestore();

  return db
    .collection(`Commerces/${commerceId}/Services`)
    .where('softDelete', '==', null)
    .where('employeesIds', 'array-contains', employeeId)
    .orderBy('name', 'asc')
    .onSnapshot(snapshot => {
      const services = [];
      snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_SERVICES_READ, payload: services });
    });
};

export const onServiceDelete = ({ id, commerceId }) => {
  const db = firebase.firestore();

  return dispatch => {
    db.doc(`Commerces/${commerceId}/Services/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_SERVICE_DELETE }));
  };
};

export const onServiceUpdate = ({ id, name, duration, price, description, employeesIds, commerceId }, navigation) => {
  const db = firebase.firestore();
  const servicesRef = db.collection(`Commerces/${commerceId}/Services`);

  return async dispatch => {
    dispatch({ type: ON_SERVICE_FORM_SUBMIT });
    try {
      const snapshot = await servicesRef
        .where('name', '==', name)
        .where('softDelete', '==', null)
        .get();

      if (!snapshot.empty && snapshot.docs[0].id !== id) {
        return dispatch({ type: ON_SERVICE_EXISTS });
      }

      servicesRef
        .doc(id)
        .update({ name, duration, price, description, employeesIds })
        .then(() => {
          dispatch({ type: ON_SERVICE_UPDATE });
          navigation.goBack();
        });
    } catch (error) {
      console.error(error);
    }
  };
};

export const onServiceOfferingUpdate = ({ id, employeesIds, commerceId }) => {
  // rename
  const db = firebase.firestore();

  db.doc(`Commerces/${commerceId}/Services/${id}`).update({ employeesIds });
};
