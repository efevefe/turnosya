import firebase from 'firebase/app';
import 'firebase/firestore';
import { COMMERCE_LIST_READ, COMMERCE_LIST_READING } from './types';

export const commercesRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COMMERCE_LIST_READING });
    db.collection('Commerces').onSnapshot(snapShot => {
      var commerces = [];
      snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: COMMERCE_LIST_READ, payload: commerces });
    });
  };
};
