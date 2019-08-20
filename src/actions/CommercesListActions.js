import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED
} from './types';

export const commercesRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCES_LIST_READING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_COMMERCES_LIST_READ, payload: commerces });
      });
  };
};

export const searchCommerces = search => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCES_LIST_SEARCHING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => {
          const name = doc.data().name.toLowerCase();
          if (name.includes(search.toLowerCase())) {
            commerces.push({ ...doc.data(), id: doc.id });
          }
        });

        dispatch({ type: ON_COMMERCES_LIST_SEARCHED, payload: commerces });
      });
  };
};
