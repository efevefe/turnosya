import firebase from "firebase/app";
import "firebase/firestore";
import {
  ON_CLIENT_RESERVATIONS_READ,
  ON_CLIENT_RESERVATIONS_READING,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL,
  ON_CLIENT_RESERVATION_CANCELING
} from "./types";
import moment from "moment";

export const onClientReservationsListRead = () => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_CLIENT_RESERVATIONS_READING });
    db.collection(`Profiles/${currentUser.uid}/Reservations`)
      .where("state", "==", null)
      .orderBy("startDate", "asc")
      .onSnapshot(snapshot => {
        const reservations = [];
        if (snapshot.empty) {
          return dispatch({
            type: ON_CLIENT_RESERVATIONS_READ,
            payload: reservations
          });
        }
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
                      type: ON_CLIENT_RESERVATIONS_READ,
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
      db
        .doc(`ReservationStates/canceled`)
        .get()
        .then(stateDoc => {
          const cancelationDate = new Date();
          batch.update(
            db.doc(
              `Profiles/${currentUser.uid}/Reservations/${reservationsId}`
            ),
            {
              state: { id: stateDoc.id, name: stateDoc.data().name },
              cancelationDate
            }
          );
          batch.update(
            db.doc(`Commerces/${commerceId}/Reservations/${reservationsId}`),
            {
              state: { id: stateDoc.id, name: stateDoc.data().name },
              cancelationDate
            }
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
          })
        );
  };
};
