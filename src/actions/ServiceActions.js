import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_VALUE_CHANGE, SERVICE_CREATE, SERVICES_FETCH, SERVICE_DELETE } from './types';

export const onValueChange = ({ prop, value }) => {
  return { type: ON_VALUE_CHANGE, payload: { prop, value } };
};

export const serviceCreate = ({ name, duration, price, description }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/${currentUser.uid}/Services`)
      .add({ name, duration, price, description })
      .then(() => dispatch({ type: SERVICE_CREATE }))
      .catch(error => console.log(error));
  };
};

export const servicesFetch = () => {
  //const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    //db.collection(`Commerces/${currentUser.uid}/Services`).get()
    db.collection(`Commerces/dRUgwONi3CWOTwuxAm0c9SSKcs03/Services`).get()
    .then(snapshot => {
      var services = [];
      snapshot.forEach(doc => services.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: SERVICES_FETCH, payload: services });
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
