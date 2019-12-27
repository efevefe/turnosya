import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_CLIENT_REVIEWS_READING,
  ON_CLIENT_REVIEWS_READ,
  ON_CLIENT_REVIEWS_READ_FAIL
} from './types';

export const readClientReviews = clientId => dispatch => {
  dispatch({ type: ON_CLIENT_REVIEWS_READING });

  const db = firebase.firestore();
  let reviews = [];

  db.collection(`Profiles/${clientId}/Reviews`)
    .where('softDelete', '==', null)
    .orderBy('date', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => reviews.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_CLIENT_REVIEWS_READ, payload: reviews });
    })
    .catch(() => dispatch({ type: ON_CLIENT_REVIEWS_READ_FAIL }));
};
