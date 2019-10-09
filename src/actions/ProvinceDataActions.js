import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_PROVINCES_READ } from './types';

export const onProvincesRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Provinces')
      .orderBy('name', 'asc')
      .get()
      .then(snapshot => {
        var provincesList = [];
        snapshot.forEach(doc =>
          provincesList.push({ value: doc.id, label: doc.data().name })
        );
        dispatch({ type: ON_PROVINCES_READ, payload: provincesList });
      });
  };
};
