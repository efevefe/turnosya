import firebase from "firebase/app";
import "firebase/firestore";
import {
  ON_CLIENT_RERSERVATION_READ,
  ON_CLIENT_RERSERVATION_READING,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL,
  ON_CLIENT_RESERVATION_CANCELING
} from "./types";
import moment from "moment";

export const onClientReservationsListRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_CLIENT_RERSERVATION_READING });
    db.collection(`Profiles/${currentUser.uid}/Reservations`)
      .orderBy("startDate", "asc")
      .onSnapshot(snapshot => {
        var reservations = [];
        snapshot.forEach(doc => {
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
                  if (snapshot.size === reservations.length)
                    dispatch({
                      type: ON_CLIENT_RERSERVATION_READ,
                      payload: reservations
                    });
                });
            });
        });
      });
  };
};

export const onClientCancelReservation = (
  reservationsId,
  commerceId,
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  var batch = db.batch();
  return dispatch => {
    dispatch({ type: ON_CLIENT_RESERVATION_CANCELING }),
    db.doc(`ReservationStates/canceled`)
      .get()
      .then(stateDoc => {
        batch.update(
          db.doc(`Profiles/${currentUser.uid}/Reservations/${reservationsId}`),
          { state: stateDoc.data().name }
        );
        batch.update(
          db.doc(`Commerces/${commerceId}/Reservations/${reservationsId}`),
          { state: stateDoc.data().name }
        );

        batch
          .commit()
          .then(
            dispatch({ type: ON_CLIENT_RESERVATION_CANCEL }),
            navigation.goBack()
          )
          .catch(
            dispatch({
              type: ON_CLIENT_RESERVATION_CANCEL_FAIL
            })
          );
      })          
      .catch(
        dispatch({
          type: ON_CLIENT_RESERVATION_CANCEL_FAIL
        }))
  };
};