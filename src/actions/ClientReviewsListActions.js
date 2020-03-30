import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_CLIENT_REVIEWS_READING, ON_CLIENT_REVIEWS_READ, ON_CLIENT_REVIEWS_READ_FAIL } from './types';

export const onClientReviewsRead = (clientId, lastVisible = null) => dispatch => {
  dispatch({ type: ON_CLIENT_REVIEWS_READING, payload: lastVisible ? 'refreshing' : 'loading' });

  const db = firebase.firestore();
  let reviews = [];

  let query = db.collection(`Profiles/${clientId}/Reviews`)
    .where('softDelete', '==', null)
    .orderBy('date', 'desc');

  if (lastVisible) query = query.startAfter(lastVisible);

  query
    .limit(12)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => reviews.push({ ...doc.data(), id: doc.id }));
      dispatch({ type: ON_CLIENT_REVIEWS_READ, payload: { reviews, firstRead: !lastVisible } });
    })
    .catch(() => dispatch({ type: ON_CLIENT_REVIEWS_READ_FAIL }));
};
