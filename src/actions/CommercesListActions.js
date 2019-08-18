import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCES_READING, 
  ON_COMMERCES_READ, 
  ON_COMMERCES_SEARCHING, 
  ON_COMMERCES_SEARCHED
} from './types';

export const commercesRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    //dispatch({ type: ON_COMMERCE_LIST_OPEN });
    dispatch({ type: ON_COMMERCES_READING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_COMMERCES_READ, payload: commerces });
      });
  };
};

export const searchCommerces = search => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCES_SEARCHING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .startAt(search)
      .endAt(`${search}\uf8ff`)
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_COMMERCES_SEARCHED, payload: commerces });
      });
  };
};
