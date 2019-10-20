import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  ON_SCHEDULE_CARD_VALUE_CHANGE,
  ON_SCHEDULE_CARD_DELETE,
  ON_SCHEDULE_READ,
  ON_SCHEDULE_READING,
  ON_SCHEDULE_READ_FAIL,
  ON_SCHEDULE_CREATED,
  ON_SCHEDULE_CREATING,
  ON_SCHEDULE_CREATE_FAIL,
  ON_SCHEDULE_CONFIG_UPDATING,
  ON_SCHEDULE_CONFIG_UPDATED,
  ON_SCHEDULE_READ_EMPTY
} from './types';

export const onScheduleValueChange = ({ prop, value }) => {
  return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop, value } };
};

export const onScheduleCardValueChange = card => {
  return { type: ON_SCHEDULE_CARD_VALUE_CHANGE, payload: card };
};

export const onScheduleCardDelete = cardId => {
  return { type: ON_SCHEDULE_CARD_DELETE, payload: cardId };
};

export const onScheduleFormOpen = () => {
  return { type: ON_SCHEDULE_FORM_OPEN };
};

export const onScheduleRead = ({ commerceId, selectedDate }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_READING });

    db.collection(`Commerces/${commerceId}/Schedules`)
      .where('startDate', '<=', selectedDate.toDate())
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return dispatch({ type: ON_SCHEDULE_READ_EMPTY });
        }

        snapshot.forEach(doc => {
          const { reservationDayPeriod, reservationMinLength, startDate, endDate } = doc.data();

          // ver como mejorar este filtrado
          if (!endDate || (endDate && moment(endDate.toDate()) > selectedDate)) {
            db.collection(`Commerces/${commerceId}/Schedules/${doc.id}/WorkShifts`)
              .get()
              .then(snapshot => {
                if (snapshot.empty) {
                  return dispatch({ type: ON_SCHEDULE_READ_EMPTY });
                }

                const cards = [];
                let selectedDays = [];

                snapshot.forEach(doc => {
                  cards.push({ ...doc.data(), id: parseInt(doc.id) });
                  selectedDays = [ ...selectedDays, ...doc.data().days ];
                });

                dispatch({
                  type: ON_SCHEDULE_READ,
                  payload: {
                    cards,
                    selectedDays,
                    reservationDayPeriod,
                    reservationMinLength,
                    startDate: moment(startDate.toDate()),
                    endDate: endDate ? moment(endDate.toDate()) : endDate
                  }
                });
              })
              .catch(error => dispatch({ type: ON_SCHEDULE_READ_FAIL }));
          }
        })
      })
      .catch(error => dispatch({ type: ON_SCHEDULE_READ_FAIL }));
  };
};

export const onScheduleUpdate = ({ commerceId, cards, reservationMinLength, reservationDayPeriod, startDate }, navigation) => {
  const db = firebase.firestore();
  const batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CREATING });

    db.collection(`Commerces/${commerceId}/Schedules/`)
      .where('endDate', '==', null)
      .get()
      .then(snapshot => {
        snapshot.forEach(oldSchedule => {
          // la vigencia de la diagramacion anterior termina donde empieza la nueva
          batch.update(oldSchedule.ref, { endDate: startDate.toDate() });
        });

        db.collection(`Commerces/${commerceId}/Schedules/`)
          .add({ startDate: startDate.toDate(), endDate: null, reservationMinLength, reservationDayPeriod })
          .then(scheduleRef => {
            cards.forEach(card => {
              const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

              const ref = db
                .collection(`Commerces/${commerceId}/Schedules/${scheduleRef.id}/WorkShifts`)
                .doc(`${card.id}`);
              batch.set(ref, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
            });

            batch.commit()
              .then(() => {
                dispatch({ type: ON_SCHEDULE_CREATED });
                navigation.navigate('calendar');
              })
              .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
          })
          .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
      })
      .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
  }
};

export const onScheduleConfigSave = ({
  reservationMinLength,
  reservationDayPeriod,
  commerceId
},
  navigation
) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CONFIG_UPDATING });

    db.doc(`Commerces/${commerceId}/Schedules/0`)
      .set({ reservationMinLength, reservationDayPeriod }, { merge: true })
      .then(() => {
        navigation.navigate('calendar');
        dispatch({ type: ON_SCHEDULE_CONFIG_UPDATED })
      });
  };
};
