import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_REFINEMENT_UPDATE,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ
} from './types';

export const refinementUpdate = refinement => {
  return { type: ON_REFINEMENT_UPDATE, payload: refinement };
};

export const areasRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_AREAS_READING });
    db.collection('Areas')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        const areas = [];
        snapShot.forEach(doc => areas.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_AREAS_SEARCH_READ, payload: areas });
      });
  };
};
