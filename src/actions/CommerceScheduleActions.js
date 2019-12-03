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

export const onScheduleRead = ({ commerceId, selectedDate }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  const db = firebase.firestore();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  let schedule;

  try {
    // reading schedule
    let snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '>=', selectedDate.toDate())
      .orderBy('endDate')
      .get();

    if (snapshot.empty) {
      snapshot = await schedulesRef.where('softDelete', '==', null).where('endDate', '==', null).get();
    }

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        if (moment(doc.data().startDate.toDate()) <= selectedDate) {
          schedule = formatScheduleDoc({ id: doc.id, ...doc.data() });
        }
      });
    }

    if (snapshot.empty || !schedule) {
      return dispatch({ type: ON_SCHEDULE_READ_EMPTY });
    }

    // reading schedule cards
    snapshot = await db.collection(`Commerces/${commerceId}/Schedules/${schedule.id}/WorkShifts`).get();
    let cards = [];
    let selectedDays = [];

    snapshot.forEach(doc => {
      cards.push({ ...doc.data(), id: parseInt(doc.id) });
      selectedDays = [...selectedDays, ...doc.data().days];
    });

    schedule = { ...schedule, cards, selectedDays };

    dispatch({ type: ON_SCHEDULE_READ, payload: schedule });
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_READ_FAIL })
  }
};

export const onActiveSchedulesRead = ({ commerceId, date }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  const db = firebase.firestore();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  const schedules = [];

  try {
    // reading active schedules
    let snapshot = await schedulesRef.where('softDelete', '==', null).where('endDate', '>=', date).orderBy('endDate').get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() })));
    }

    snapshot = await schedulesRef.where('softDelete', '==', null).where('endDate', '==', null).get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() })));
    };

    if (!schedules.length) return dispatch({ type: ON_SCHEDULE_READ_EMPTY });

    // reading cards for each active schedule
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

export const onScheduleUpdate = scheduleData => async dispatch => {
  dispatch({ type: ON_SCHEDULE_CREATING });

  const {
    commerceId,
    scheduleId,
    cards,
    reservationMinLength,
    reservationDayPeriod,
    startDate,
    endDate,
    schedules,
    reservationsToCancel
  } = scheduleData;

  const db = firebase.firestore();
  const batch = db.batch();

  schedules.forEach(schedule => {
    const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${schedule.id}`);

    if ((schedule.startDate < startDate) && (!schedule.endDate || (startDate < schedule.endDate))) {
      // batch.update(scheduleRef, { endDate: startDate.toDate() });
      console.log('endDate ==> startDate');
    }

    if ((schedule.startDate >= startDate) && (!endDate || (schedule.endDate && (schedule.endDate <= endDate)))) {
      // revisar esto
      if (schedule.id === scheduleId) {
        // batch.delete(scheduleRef);
        console.log('delete old schedule');
      } else {
        // batch.update(scheduleRef, { softDelete: new Date() });
        console.log('softDelete');
      }
    }

    if ((endDate && (endDate > schedule.startDate)) &&
      (!schedule.endDate || (endDate && endDate < schedule.endDate)) &&
      (schedule.startDate >= startDate)
    ) {
      // batch.update(scheduleRef, { startDate: endDate.toDate() });
      console.log('startDate ==> endDate');
    }
  })

  try {
    // new schedule creation
    // const newSchedule = await db.collection(`Commerces/${commerceId}/Schedules/`)
    //   .add({
    //     startDate: startDate.toDate(),
    //     endDate: endDate.toDate(),
    //     softDelete: null,
    //     reservationMinLength,
    //     reservationDayPeriod
    //   });

    // cards.forEach(card => {
    //   const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

    //   const cardRef = db.doc(`Commerces/${commerceId}/Schedules/${newSchedule.id}/WorkShifts/${card.id}`);
    //   batch.set(cardRef, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
    // });

    // reservations cancel
    if (reservationsToCancel.length) {
      const state = await db.doc(`ReservationStates/canceled`).get();
      const updateObj = {
        cancellationDate: new Date(),
        state: { id: state.id, name: state.data().name }
      };

      reservationsToCancel.forEach(res => {
        const commerceResRef = db.doc(`Commerces/${commerceId}/Reservations/${res.id}`);
        const clientResRef = db.doc(`Profiles/${res.clientId}/Reservations/${res.id}`);
        //batch.update(commerceResRef, updateObj);
        //batch.update(clientResRef, updateObj);
      });
    }

    // await batch.commit();

    dispatch({ type: ON_SCHEDULE_CREATED });
    return true;
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
    return false;
  }
};

export const onScheduleDelete = ({ commerceId, schedule, endDate, reservationsToCancel }) => async dispatch => {
  const db = firebase.firestore();
  const batch = db.batch();
  const scheduleRef = db.doc(`Commerces/${commerceId}/Schedules/${schedule.id}`);

  try {
    if (reservationsToCancel.length) {
      const state = await db.doc(`ReservationStates/canceled`).get();
      const updateObj = {
        cancellationDate: new Date(),
        state: { id: state.id, name: state.data().name }
      };

      reservationsToCancel.forEach(res => {
        const commerceResRef = db.doc(`Commerces/${commerceId}/Reservations/${res.id}`);
        const clientResRef = db.doc(`Profiles/${res.clientId}/Reservations/${res.id}`);
        //batch.update(commerceResRef, updateObj);
        //batch.update(clientResRef, updateObj);
      });
    }

    if (endDate <= schedule.startDate) {
      // batch.update(scheduleRef, { softDelete: new Date() });
      console.log('softDelete');
    } else {
      // batch.update(scheduleRef, { endDate: endDate.toDate() });
      console.log('endDate ==> lastReservation')
    }

    // await batch.commit();

    dispatch({ type: ON_SCHEDULE_CREATED });
  } catch (error) {
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
