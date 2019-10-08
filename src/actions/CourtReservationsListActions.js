import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
    ON_COMMERCE_COURT_RESERVATIONS_READING,
    ON_COMMERCE_COURT_RESERVATIONS_READ,
    ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL
} from "./types";

export const onCommerceCourtReservationsRead = ({ commerceId, selectedDate }) => {
    const db = firebase.firestore();

    return dispatch => {
        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READING });

        db.collection(`Commerces/${commerceId}/Reservations`)
            .where('startDate', '>=', selectedDate.toDate())
            .where('startDate', '<', moment(selectedDate).add(1, 'days').toDate())
            .orderBy('startDate')
            //.get()
            .onSnapshot(snapshot => {
                var reservations = [];
                var processedItems = 0;

                snapshot.forEach(doc => {
                    db.doc(`Commerces/${commerceId}/Courts/${doc.data().courtId}`)
                        .get()
                        .then(court => {
                            db.doc(`Profiles/${doc.data().clientId}`)
                                .get()
                                .then(client => {
                                    reservations.push({
                                        id: doc.id,
                                        ...doc.data(),
                                        startDate: moment(doc.data().startDate.toDate()),
                                        endDate: moment(doc.data().endDate.toDate()),
                                        reservationDate: moment(doc.data().reservationDate.toDate()),
                                        client: { id: client.id, ...client.data() },
                                        court: { id: court.id, ...court.data() }
                                    });

                                    processedItems++;

                                    if (processedItems === snapshot.size) {
                                        dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ, payload: reservations });
                                    }
                                });
                        });
                });
            })
            /*
            .catch(error => {
                console.log(error);
                dispatch({ type: ON_COMMERCE_COURT_RESERVATIONS_READ_FAIL });
            });
            */
    }
}

























































































