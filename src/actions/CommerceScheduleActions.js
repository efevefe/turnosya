import firebase from 'firebase/app';
import 'firebase/firestore';
import {
    ON_SCHEDULE_READ,
    ON_SCHEDULE_READING,
    ON_SCHEDULE_READ_FAIL,
    ON_SCHEDULE_VALUE_CHANGE
} from './types';

export const onScheduleValueChange = ({ prop, value }) => {
    return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop, value } };
};

export const onScheduleRead = () => {
    const db = firebase.firestore();

    return dispatch => {
        dispatch({ type: ON_SCHEDULE_READING });

        //ruta hardcodeada para probar
        db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules')
            .where('endDate', '==', null)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var { reservationDayPeriod, reservationMinLength } = doc.data();

                    db.collection(`Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/${doc.id}/WorkShifts`)
                        .get()
                        .then(snapshot => {
                            var cards = [];
                            var selectedDays = [];

                            snapshot.forEach(doc => {
                                cards.push({ ...doc.data(), id: parseInt(doc.id) });
                                selectedDays = selectedDays.concat(doc.data().days);
                            });

                            dispatch({
                                type: ON_SCHEDULE_READ,
                                payload: { cards, selectedDays, reservationDayPeriod, reservationMinLength }
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            dispatch({ type: ON_SCHEDULE_READ_FAIL });
                        });
                })
            })
            .catch(error => {
                console.log(error);
                dispatch({ type: ON_SCHEDULE_READ_FAIL });
            });
    };
};
