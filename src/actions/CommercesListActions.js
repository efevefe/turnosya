import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  COMMERCE_LIST_READ,
  COMMERCE_LIST_READING,
  ON_COMMERCE_LIST_OPEN
} from './types';

export const commercesRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_LIST_OPEN });
    dispatch({ type: COMMERCE_LIST_READING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: COMMERCE_LIST_READ, payload: commerces });
      });
  };
};

export const searchCommerces = search => {
  var db = firebase.firestore();

  return dispatch => {
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .startAt(search)
      .endAt(`${search}\uf8ff`)
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: COMMERCE_LIST_READ, payload: commerces });
      });
  };
};
