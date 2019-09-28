import firebase from 'firebase/app';
import 'firebase/firestore';
import { CLIENT_RERSERVATION_READ, CLIENT_RERSERVATION_READING, CLIENT_RERSERVATION_FAIL } from './types';
import moment from 'moment'

export const onClientReservationListRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: CLIENT_RERSERVATION_READING });
    db.collection(`Profiles/${currentUser.uid}/Reservations`)
      .get()
      .then(snapshot => {
        var reservations = [];
        snapshot.forEach(doc => {
          db.doc(`Commerces/${doc.data().commerceId}`).get().then(doc1 => {
            db.doc(`Commerces/${doc.data().commerceId}/Courts/${doc.data().courtId}`).get().then(doc2 => {
              reservations.push({
                ...doc.data(),
                courtName: doc2.data().name,
                commerceName: doc1.data().name,
                id: doc.id,
                startDate: moment(doc.data().startDate.toDate()).toString(),
                endDate: moment(doc.data().endDate.toDate()).toString(),
              }); dispatch({ type: CLIENT_RERSERVATION_READ, payload: reservations });
            });
          }
          )
        })
          .catch(error => dispatch({ type: CLIENT_RERSERVATION_FAIL, payload: error }));
      })
  }
}


