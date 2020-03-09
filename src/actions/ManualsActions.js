import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_MANUAL_READING,
  ON_MANUAL_READ,
  ON_MANUAL_READ_FAIL
} from './types';

export const onManualRead = section => dispatch => {
  dispatch({ type: ON_MANUAL_READING });

  const db = firebase.firestore();

  db
    .doc(`Manuals/${section}`)
    .get()
    .then(doc => dispatch({ type: ON_MANUAL_READ, payload: doc.data().url }))
    .catch(error => {
      console.error(error);
      dispatch({ type: ON_MANUAL_READ_FAIL });
    })
}