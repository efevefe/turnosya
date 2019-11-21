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
  const batch = db.batch();

  const reviewRef = db.collection(`Commerces/${commerceId}/Reviews`).doc();
  batch.set(reviewRef, {
    rating,
    comment,
    date: currentDate,
    clientId: currentUser.uid,
    softDelete: null
  });

  const reservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);
  batch.update(reservationRef, { reviewId: reviewRef.id });
  console.log("create");
  batch
    .commit()
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
          console.log("read");
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
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_SAVING });

  const db = firebase.firestore();
  const currentDate = moment().format();

  db.collection(`Commerces/${commerceId}/Reviews`)
    .doc(reviewId)
    .update({
      rating,
      comment,
      date: currentDate
    })
    .then(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVED }))
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_SAVE_FAIL }));
};

export const deleteCommerceReview = ({
  commerceId,
  reservationId,
  reviewId
}) => dispatch => {
  dispatch({ type: ON_COMMERCE_REVIEW_DELETING });

  const db = firebase.firestore();
  const { currentUser } = firebase.auth();
  const currentDate = moment().format();

  const batch = db.batch();

  const reviewRef = db
    .collection(`Commerces/${commerceId}/Reviews`)
    .doc(reviewId);
  batch.update(reviewRef, { softDelete: currentDate });

  const reservationRef = db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .doc(reservationId);
  batch.update(reservationRef, { reviewId: null });

  batch
    .commit()
    .then(() => dispatch({ type: ON_COMMERCE_REVIEW_DELETED }))
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_DELETE_FAIL }));
};

export const commerceReviewClear = () => {
  return { type: ON_COMMERCE_REVIEW_CLEAR };
};
