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
  ON_SCHEDULE_READ_EMPTY,
  ON_ACTIVE_SCHEDULES_READ
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
      .where('softDelete', '==', null)
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
                  selectedDays = [...selectedDays, ...doc.data().days];
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

const formatScheduleDoc = scheduleDoc => {
  const { id, reservationDayPeriod, reservationMinLength, startDate, endDate } = scheduleDoc;

  return {
    id,
    startDate: moment(startDate.toDate()),
    endDate: endDate ? moment(endDate.toDate()) : null,
    reservationDayPeriod,
    reservationMinLength
  }
}

export const onActiveSchedulesRead = ({ commerceId, date }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  const db = firebase.firestore();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  const schedules = [];

  try {
    let snapshot = await schedulesRef.where('softDelete', '==', null).where('endDate', '>=', date).orderBy('endDate').get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() })));
    }

    snapshot = await schedulesRef.where('softDelete', '==', null).where('endDate', '==', null).get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() })));
    };

    if (!schedules.length) return dispatch({ type: ON_SCHEDULE_READ_EMPTY });

    for (i in schedules) {
      snapshot = await db.collection(`Commerces/${commerceId}/Schedules/${schedules[i].id}/WorkShifts`).get();
      let cards = [];
      let selectedDays = [];

      snapshot.forEach(doc => {
        cards.push({ ...doc.data(), id: parseInt(doc.id) });
        selectedDays = [...selectedDays, ...doc.data().days];
      });

      schedules[i] = { ...schedules[i], cards, selectedDays };
    }

    dispatch({ type: ON_ACTIVE_SCHEDULES_READ, payload: schedules });
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_READ_FAIL })
  }
}

// export const onScheduleUpdate = ({ commerceId, cards, reservationMinLength, reservationDayPeriod, startDate }, navigation) => {
//   const db = firebase.firestore();
//   const batch = db.batch();

//   return dispatch => {
//     dispatch({ type: ON_SCHEDULE_CREATING });

//     db.collection(`Commerces/${commerceId}/Schedules/`)
//       .where('endDate', '==', null)
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(oldSchedule => {
//           // la vigencia de la diagramacion anterior termina donde empieza la nueva
//           batch.update(oldSchedule.ref, { endDate: startDate.toDate() });
//         });

//         db.collection(`Commerces/${commerceId}/Schedules/`)
//           .add({ startDate: startDate.toDate(), endDate: null, reservationMinLength, reservationDayPeriod })
//           .then(scheduleRef => {
//             cards.forEach(card => {
//               const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

//               const ref = db
//                 .collection(`Commerces/${commerceId}/Schedules/${scheduleRef.id}/WorkShifts`)
//                 .doc(`${card.id}`);
//               batch.set(ref, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
//             });

//             batch.commit()
//               .then(() => {
//                 dispatch({ type: ON_SCHEDULE_CREATED });
//                 navigation.navigate('calendar');
//               })
//               .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
//           })
//           .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
//       })
//       .catch(error => dispatch({ type: ON_SCHEDULE_CREATE_FAIL }));
//   }
// };

// export const onScheduleUpdate = (scheduleData, navigation) => async dispatch => {
//   dispatch({ type: ON_SCHEDULE_CREATING });

//   const { commerceId, cards, reservationMinLength, reservationDayPeriod, startDate, endDate, schedules } = scheduleData;
//   const db = firebase.firestore();
//   const batch = db.batch();

//   schedules.forEach(schedule => {
//     const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${schedule.id}`);

//     if ((schedule.startDate < startDate) && (!schedule.endDate || (schedule.endDate > startDate))) {
//       batch.update(scheduleRef, { endDate: startDate.toDate() })
//     }

//     if (schedule.startDate >= startDate) {
//       batch.update(scheduleRef, { softDelete: new Date() });
//     }
//   })

//   try {
//     const newSchedule = await db.collection(`Commerces/${commerceId}/Schedules/`)
//       .add({ startDate: startDate.toDate(), endDate: null, softDelete: null, reservationMinLength, reservationDayPeriod });

//     cards.forEach(card => {
//       const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

//       const cardRef = db.doc(`Commerces/${commerceId}/Schedules/${newSchedule.id}/WorkShifts/${card.id}`);
//       batch.set(cardRef, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
//     });

//     await batch.commit();

//     dispatch({ type: ON_SCHEDULE_CREATED });
//     navigation.goBack();
//   } catch (error) {
//     dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
//   }
// };

export const onScheduleUpdate = (scheduleData, navigation) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_CREATING });

  const { commerceId, cards, reservationMinLength, reservationDayPeriod, startDate, endDate, schedules } = scheduleData;
  const db = firebase.firestore();
  const batch = db.batch();

  schedules.forEach(schedule => {
    const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${schedule.id}`);

    if ((schedule.startDate < startDate) && (!schedule.endDate || (schedule.endDate > startDate))) {
      batch.update(scheduleRef, { endDate: startDate.toDate() })
    }
  })

  try {
    const newSchedule = await db.collection(`Commerces/${commerceId}/Schedules/`)
      .add({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        softDelete: null,
        reservationMinLength,
        reservationDayPeriod
      });

    cards.forEach(card => {
      const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

      const cardRef = db.doc(`Commerces/${commerceId}/Schedules/${newSchedule.id}/WorkShifts/${card.id}`);
      batch.set(cardRef, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
    });

    await batch.commit();

    dispatch({ type: ON_SCHEDULE_CREATED });
    navigation.goBack();
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
  }
};

export const onScheduleDelete = ({ commerceId, scheduleId, endDate }) => async dispatch => {
  const db = firebase.firestore();
  const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${scheduleId}`)

  try {
    await scheduleRef.update({ endDate: endDate.toDate() });
    dispatch({ type: ON_SCHEDULE_CREATED });
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
  }
}

export const onScheduleDeleteWithReservations = ({ commerceId, schedule, endDate, reservations }) => async dispatch => {
  const db = firebase.firestore();
  const batch = db.batch();
  const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${schedule.id}`);

  try {
    const state = await db.doc(`ReservationStates/canceled`).get();

    reservations.forEach(res => {
      const commerceResRef = db.doc(`Commerces/${commerceId}/Reservations/${res.id}`);
      const clientResRef = db.doc(`Profiles/${res.clientId}/Reservations/${res.id}`);
      //batch.update(commerceResRef, { state: { id: state.id, name: state.data().name } });
      //batch.update(clientResRef, { state: { id: state.id, name: state.data().name } });
    });

    if (endDate <= schedule.startDate) {
      batch.update(scheduleRef, { softDelete: new Date() });
    } else {
      batch.update(scheduleRef, { endDate: endDate.toDate() });
    }

    await batch.commit();

    dispatch({ type: ON_SCHEDULE_CREATED });
  } catch (error) {
    console.log(error);
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
  }
}

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
