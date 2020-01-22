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
  ON_SERVICE_UPDATE
} from './types';

export const onServiceValueChange = payload => {
  return { type: ON_SERVICE_VALUE_CHANGE, payload };
};

export const onFormOpen = () => {
  return { type: ON_FORM_OPEN };
};

export const onServiceCreate = (
  { name, duration, price, description, commerceId },
  navigation
) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SERVICE_FORM_SUBMIT });

    db.collection(`Commerces/${commerceId}/Services`)
      .add({ name, duration, price, description, softDelete: null })
      .then(() => {
        dispatch({ type: ON_SERVICE_CREATE });
        navigation.goBack();
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

export const onServiceDelete = ({ id, commerceId }) => {
  const db = firebase.firestore();

  return dispatch => {
    db.doc(`Commerces/${commerceId}/Services/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_SERVICE_DELETE }));
  };
};

export const onServiceUpdate = (
  { id, name, duration, price, description, commerceId },
  navigation
) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SERVICE_FORM_SUBMIT });

    db.doc(`Commerces/${commerceId}/Services/${id}`)
      .update({ name, duration, price, description })
      .then(() => {
        dispatch({ type: ON_SERVICE_UPDATE });
        navigation.goBack();
      });
  };
};
