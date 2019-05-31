import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_VALUE_CHANGE, SERVICE_CREATE, SERVICES_READ, SERVICE_DELETE, SERVICE_UPDATE } from './types';

export const onValueChange = ({ prop, value }) => {
  return { type: ON_VALUE_CHANGE, payload: { prop, value } };
};

export const serviceCreate = ({ name, duration, price, description }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
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
    //db.collection(`Commerces/${currentUser.uid}/Services`).get()
    db.collection(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services`).where('softDelete', '==', null)
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
}

export const serviceUpdate = ({ id, name, duration, price, description }) => {
  //const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    //db.doc(`Commerces/${currentUser.uid}/Services/${id}`)
    db.doc(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services/${id}`)
      .update({ name, duration, price, description })
      .then(() => dispatch({ type: SERVICE_UPDATE }));
  };
}
