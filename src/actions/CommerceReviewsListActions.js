import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REVIEWS_READING,
  ON_COMMERCE_REVIEWS_READ,
  ON_COMMERCE_REVIEWS_READ_FAIL
} from './types';

export const onCommerceReviewsRead = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEWS_READING });

  const db = firebase.firestore();
  let reviews = [];

  db.collection(`Commerces/${commerceId}/Reviews`)
    .where('softDelete', '==', null)
    .orderBy('date', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => reviews.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_COMMERCE_REVIEWS_READ, payload: reviews });
    })
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEWS_READ_FAIL }));
};
