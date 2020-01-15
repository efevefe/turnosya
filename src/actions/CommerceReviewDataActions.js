import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCE_REVIEW_VALUE_CHANGE,
  ON_COMMERCE_REVIEW_SAVED,
  ON_COMMERCE_REVIEW_SAVING,
  ON_COMMERCE_REVIEW_SAVE_FAIL,
  ON_COMMERCE_REVIEW_CLEAR,
  ON_COMMERCE_REVIEW_CREATED,
  ON_COMMERCE_REVIEW_DELETED,
  ON_COMMERCE_REVIEW_DELETING,
  ON_COMMERCE_REVIEW_DELETE_FAIL,
  ON_COMMERCE_REVIEW_READ,
  ON_COMMERCE_REVIEW_READING,
  ON_COMMERCE_REVIEW_READ_FAIL
} from './types';

export const commerceReviewValueChange = payload => {
  return { type: ON_COMMERCE_REVIEW_VALUE_CHANGE, payload };
};

export const createCommerceReview = ({
  commerceId,
  rating,
  comment,
  reservationId
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_SAVING });

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  const reviewRef = db.collection(`Commerces/${commerceId}/Reviews`).doc();
  const clientReservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);
  const commerceReservationRef = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .doc(reservationId);
  const commerceRef = db.collection('Commerces').doc(commerceId);

  db.runTransaction(transaction => {
    return transaction.get(commerceRef).then(commerce => {
      const commerceRating = commerce.data().rating;
      const ratingTotal = commerceRating ? commerceRating.total : 0;
      const ratingCount = commerceRating ? commerceRating.count : 0;

      transaction.set(reviewRef, {
        rating,
        comment,
        date: new Date(),
        clientId: currentUser.uid,
        reservationId,
        softDelete: null
      });

      transaction.update(clientReservationRef, { reviewId: reviewRef.id });
      transaction.update(commerceReservationRef, {
        receivedReviewId: reviewRef.id
      });

      transaction.update(commerceRef, {
        rating: { total: ratingTotal + rating, count: ratingCount + 1 }
      });
    });
  })
    .then(() => {
      dispatch({ type: ON_COMMERCE_REVIEW_CREATED, payload: reviewRef.id });
    })
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVE_FAIL }));
};

export const readCommerceReview = ({ commerceId, reviewId }) => dispatch => {
  const db = firebase.firestore();

  if (reviewId) {
    dispatch({ type: ON_COMMERCE_REVIEW_READING });
    db.collection(`Commerces/${commerceId}/Reviews`)
      .doc(reviewId)
      .get()
      .then(doc => {
        const { rating, comment, softDelete } = doc.data();
        softDelete
          ? dispatch({ type: ON_COMMERCE_REVIEW_READ })
          : dispatch({
              type: ON_COMMERCE_REVIEW_READ,
              payload: { rating, comment, reviewId }
            });
      })
      .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_READ_FAIL }));
  }
};

export const updateCommerceReview = ({
  commerceId,
  rating,
  comment,
  reviewId
}) => async dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_SAVING });

  const db = firebase.firestore();

  const commerceRef = db.collection('Commerces').doc(commerceId);
  const reviewRef = db
    .collection(`Commerces/${commerceId}/Reviews`)
    .doc(reviewId);

  const oldReview = await reviewRef.get();
  const oldRating = oldReview.data().rating;

  db.runTransaction(transaction => {
    return transaction.get(commerceRef).then(commerce => {
      const { total, count } = commerce.data().rating;

      transaction.update(reviewRef, {
        rating,
        comment,
        date: new Date()
      });

      transaction.update(commerceRef, {
        rating: { total: total - oldRating + rating, count }
      });
    });
  })
    .then(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVED }))
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVE_FAIL }));
};

export const deleteCommerceReview = ({
  commerceId,
  reservationId,
  reviewId
}) => async dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_DELETING });

  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  const commerceRef = db.collection('Commerces').doc(commerceId);
  const reviewRef = db
    .collection(`Commerces/${commerceId}/Reviews`)
    .doc(reviewId);
  const clientReservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);
  const commerceReservationRef = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .doc(reservationId);

  const oldReview = await reviewRef.get();
  const oldRating = oldReview.data().rating;

  db.runTransaction(transaction => {
    return transaction.get(commerceRef).then(commerce => {
      const { total, count } = commerce.data().rating;

      transaction.update(clientReservationRef, { reviewId: null });
      transaction.update(commerceReservationRef, { receivedReviewId: null });

      transaction.update(reviewRef, { softDelete: new Date() });

      transaction.update(commerceRef, {
        rating: { total: total - oldRating, count: count - 1 }
      });
    });
  })
    .then(() => dispatch({ type: ON_COMMERCE_REVIEW_DELETED }))
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_DELETE_FAIL }));
};

export const commerceReviewClear = () => {
  return { type: ON_COMMERCE_REVIEW_CLEAR };
};
