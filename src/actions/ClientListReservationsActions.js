import firebase from "firebase/app";
import "firebase/firestore";
import {
  CLIENT_RERSERVATIONS_READ,
  CLIENT_RERSERVATIONS_READING,
  CLIENT_RERSERVATIONS_FAIL,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL
} from "./types";
import moment from "moment";

export const onClientReservationListRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: CLIENT_RERSERVATIONS_READING });
    db.collection(`Profiles/${currentUser.uid}/Reservations`).orderBy(
      "startDate",
      "asc"
    ).onSnapshot(snapshot => {
      var reservations = [];
      snapshot
        .forEach(doc => {
          db.doc(`Commerces/${doc.data().commerceId}`)
            .get()
            .then(commerceData => {
              db.doc(
                `Commerces/${doc.data().commerceId}/Courts/${
                  doc.data().courtId
                }`
              )
                .get()
                .then(courtData => {
                  reservations.push({
                    ...doc.data(),
                    court: courtData.data(),
                    commerce: commerceData.data(),
                    id: doc.id,
                    startDate: moment(doc.data().startDate.toDate()),
                    endDate: moment(doc.data().endDate.toDate())
                  });
                  if (snapshot.size == reservations.length)
                    dispatch({
                      type: CLIENT_RERSERVATIONS_READ,
                      payload: reservations
                    });
                });
            });
        })
    });
  };
};

export const onPressCancelReservation = (
  reservationsId, commerceId,
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  console.log(reservationsId, commerceId);
  return dispatch => {
    db.doc(`States/Cancelled`)
      .get()
      .then(doc =>
        db
          .doc(`Profiles/${currentUser.uid}/Reservations/${reservationsId}`)
          .update({ state: doc.data().name })
          .then(
            db
              .doc(`Commerces/${commerceId}/Reservations/${reservationsId}`)
              .update({ state: doc.data().name })
              .then(
                dispatch({type: ON_CLIENT_RESERVATION_CANCEL}),
                navigation.goBack()
              )
              .catch(error =>
                dispatch({
                  type: ON_CLIENT_RESERVATION_CANCEL_FAIL,
                  payload: error
                })
              )
          )
      );
  };
};
