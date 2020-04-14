import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_COMMERCE_REVIEWS_READING, ON_COMMERCE_REVIEWS_READ, ON_COMMERCE_REVIEWS_READ_FAIL } from './types';

export const onCommerceReviewsRead = (commerceId, lastVisible = null) => dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEWS_READING, payload: lastVisible ? 'refreshing' : 'loading' });

  const db = firebase.firestore();
  let reviews = [];

  let query = db.collection(`Commerces/${commerceId}/Reviews`)
    .where('softDelete', '==', null)
    .orderBy('date', 'desc');

  if (lastVisible) query = query.startAfter(lastVisible);

  query
    .limit(12)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => reviews.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_COMMERCE_REVIEWS_READ, payload: { reviews, firstRead: !lastVisible } });
    })
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEWS_READ_FAIL }));
};
