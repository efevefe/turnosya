import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_VALUE_CHANGE,
  ON_FORM_OPEN,
  SERVICE_CREATE,
  SERVICES_READING,
  SERVICES_READ,
  SERVICE_FORM_SUBMIT,
  SERVICE_DELETE,
  SERVICE_UPDATE
} from './types';

export const onValueChange = ({ prop, value }) => {
  //pasar a un CommonActions.js
  return { type: ON_VALUE_CHANGE, payload: { prop, value } };
};

export const onFormOpen = () => {
  return { type: ON_FORM_OPEN };
};

export const serviceCreate = ({ name, duration, price, description }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: SERVICE_FORM_SUBMIT });

    db.collection(`Commerces/${currentUser.uid}/Services`)
      .add({ name, duration, price, description, softDelete: null })
      .then(() => dispatch({ type: SERVICE_CREATE }))
      .catch(error => console.log(error));
  };
};

export const servicesRead = () => {
  //const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: SERVICES_READING });

    //db.collection(`Commerces/${currentUser.uid}/Services`).get()
    db.collection(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services`)
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapshot => {
        var services = [];
        snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: SERVICES_READ, payload: services });
      });
  };
};

export const serviceDelete = ({ id }) => {
  //const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    //db.doc(`Commerces/${currentUser.uid}/Services/${id}`)
    db.doc(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: SERVICE_DELETE }));
  };
};

export const serviceUpdate = ({ id, name, duration, price, description }) => {
  //const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: SERVICE_FORM_SUBMIT });

    //db.doc(`Commerces/${currentUser.uid}/Services/${id}`)
    db.doc(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services/${id}`)
      .update({ name, duration, price, description })
      .then(() => dispatch({ type: SERVICE_UPDATE }));
  };
};
