import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_CLIENT_REVIEW_VALUE_CHANGE,
  ON_CLIENT_REVIEW_SAVED,
  ON_CLIENT_REVIEW_SAVING,
  ON_CLIENT_REVIEW_SAVE_FAIL,
  ON_CLIENT_REVIEW_CLEAR,
  ON_CLIENT_REVIEW_CREATED,
  ON_CLIENT_REVIEW_DELETED,
  ON_CLIENT_REVIEW_DELETING,
  ON_CLIENT_REVIEW_DELETE_FAIL,
  ON_CLIENT_REVIEW_READING,
  ON_CLIENT_REVIEW_READ,
  ON_CLIENT_REVIEW_READ_FAIL
} from './types';

export const clientReviewValueChange = (prop, value) => {
  return { type: ON_CLIENT_REVIEW_VALUE_CHANGE, payload: { prop, value } };
};

export const createClientReview = ({
  commerceId,
  rating,
  comment,
  reservationId,
  clientId
}) => dispatch => {
  dispatch({ type: ON_CLIENT_REVIEW_SAVING });

  const db = firebase.firestore();

  const reviewRef = db.collection(`Profiles/${clientId}/Reviews`).doc();
  const reservationRef = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .doc(reservationId);
  const clientRef = db.collection('Profiles').doc(clientId);

  db.runTransaction(transaction => {
    return transaction.get(clientRef).then(client => {
      const clientRating = client.data().rating;
      const ratingTotal = clientRating ? clientRating.total : 0;
      const ratingCount = clientRating ? clientRating.count : 0;

      transaction.set(reviewRef, {
        rating,
        comment,
        date: new Date(),
        commerceId,
        softDelete: null
      });

      transaction.update(reservationRef, { reviewId: reviewRef.id });

      transaction.update(clientRef, {
        rating: { total: ratingTotal + rating, count: ratingCount + 1 }
      });
    });
  })
    .then(() => {
      dispatch({ type: ON_CLIENT_REVIEW_CREATED, payload: reviewRef.id });
    })
    .catch(() => dispatch({ type: ON_CLIENT_REVIEW_SAVE_FAIL }));
};

export const readClientReview = ({ clientId, reviewId }) => dispatch => {
  const db = firebase.firestore();

  if (reviewId) {
    dispatch({ type: ON_CLIENT_REVIEW_READING });
    db.collection(`Profiles/${clientId}/Reviews`)
      .doc(reviewId)
      .get()
      .then(doc => {
        const { rating, comment, softDelete } = doc.data();
        if (!softDelete) {
          dispatch({
            type: ON_CLIENT_REVIEW_VALUE_CHANGE,
            payload: { prop: 'rating', value: rating }
          });
          dispatch({
            type: ON_CLIENT_REVIEW_VALUE_CHANGE,
            payload: { prop: 'comment', value: comment }
          });
        }
        dispatch({ type: ON_CLIENT_REVIEW_READ });
      })
      .catch(() => dispatch({ type: ON_CLIENT_REVIEW_READ_FAIL }));
  }
};

export const clientReviewClear = () => {
  return { type: ON_CLIENT_REVIEW_CLEAR };
};
