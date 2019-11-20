import firebase from "firebase/app";
import "firebase/firestore";
import moment from "moment";
import {
  ON_COMMERCE_REVIEW_VALUE_CHANGE,
  ON_COMMERCE_REVIEW_CREATED,
  ON_COMMERCE_REVIEW_CREATING,
  ON_COMMERCE_REVIEW_CREATE_FAIL,
  ON_COMMERCE_REVIEW_CLEAR
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
  dispatch({ type: ON_COMMERCE_REVIEW_CREATING });

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

  batch
    .commit()
    .then(() => dispatch({ type: ON_COMMERCE_REVIEW_CREATED }))
    .catch(() => dispatch({ type: ON_COMMERCE_REVIEW_CREATE_FAIL }));
};

export const readCommerceReview = (commerceId, reviewId) => dispatch => {
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

export const commerceReviewClear = () => {
  return { type: ON_COMMERCE_REVIEW_CLEAR };
};
