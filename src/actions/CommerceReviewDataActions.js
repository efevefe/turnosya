import firebase from "firebase/app";
import "firebase/firestore";
import moment from "moment";
import {
  ON_COMMERCE_REVIEW_VALUE_CHANGE,
  ON_COMMERCE_REVIEW_SAVED,
  ON_COMMERCE_REVIEW_SAVING,
  ON_COMMERCE_REVIEW_SAVE_FAIL,
  ON_COMMERCE_REVIEW_CLEAR,
  ON_COMMERCE_REVIEW_CREATED,
  ON_COMMERCE_REVIEW_DELETED,
  ON_COMMERCE_REVIEW_DELETING,
  ON_COMMERCE_REVIEW_DELETE_FAIL
} from "./types";

export const commerceReviewValueChange = (prop, value) => {
  return { type: ON_COMMERCE_REVIEW_VALUE_CHANGE, payload: { prop, value } };
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

  const currentDate = moment().format();

  const reviewRef = db.collection(`Commerces/${commerceId}/Reviews`).doc();
  const reservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);
  const commerceRef = db.collection("Commerces").doc(commerceId);

  db.runTransaction(transaction => {
    return transaction.get(commerceRef).then(commerce => {
      const commerceRating = commerce.data().rating;
      const ratingTotal = commerceRating ? commerceRating.total : 0;
      const ratingCount = commerceRating ? commerceRating.count : 0;

      transaction.set(reviewRef, {
        rating,
        comment,
        date: new Date(currentDate),
        clientId: currentUser.uid,
        softDelete: null
      });

      transaction.update(reservationRef, { reviewId: reviewRef.id });

      transaction.update(commerceRef, {
        rating: { total: ratingTotal + rating, count: ratingCount + 1 }
      });
    });
  })
    .then(() => {
      dispatch({ type: ON_COMMERCE_REVIEW_SAVED });
      dispatch({ type: ON_COMMERCE_REVIEW_CREATED, payload: reviewRef.id });
    })
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVE_FAIL }));
};

export const readCommerceReview = ({ commerceId, reviewId }) => dispatch => {
  const db = firebase.firestore();

  if (reviewId)
    db.collection(`Commerces/${commerceId}/Reviews`)
      .doc(reviewId)
      .get()
      .then(doc => {
        const { rating, comment, softDelete } = doc.data();
        if (!softDelete) {
          dispatch({
            type: ON_COMMERCE_REVIEW_VALUE_CHANGE,
            payload: { prop: "rating", value: rating }
          });
          dispatch({
            type: ON_COMMERCE_REVIEW_VALUE_CHANGE,
            payload: { prop: "comment", value: comment }
          });
        }
      });
};

export const updateCommerceReview = ({
  commerceId,
  rating,
  comment,
  reviewId
}) => async dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_SAVING });

  const db = firebase.firestore();
  const currentDate = moment().format();

  const commerceRef = db.collection("Commerces").doc(commerceId);
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
        date: new Date(currentDate)
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
  const currentDate = moment().format();

  const commerceRef = db.collection("Commerces").doc(commerceId);
  const reviewRef = db
    .collection(`Commerces/${commerceId}/Reviews`)
    .doc(reviewId);
  const reservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);

  const oldReview = await reviewRef.get();
  const oldRating = oldReview.data().rating;

  db.runTransaction(transaction => {
    return transaction.get(commerceRef).then(commerce => {
      const { total, count } = commerce.data().rating;

      transaction.update(reservationRef, { reviewId: null });

      transaction.update(reviewRef, { softDelete: currentDate });

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
