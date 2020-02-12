import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import { onReservationsCancel } from './ReservationsListActions';
import { onClientNotificationSend } from './NotificationActions';
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
  ON_ACTIVE_SCHEDULES_READ,
} from './types';

export const onScheduleValueChange = payload => {
  return { type: ON_SCHEDULE_VALUE_CHANGE, payload };
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
  const { id, reservationDayPeriod, reservationMinLength, startDate, endDate, employeeId } = scheduleDoc;

  return {
    id,
    startDate: moment(startDate.toDate()),
    endDate: endDate ? moment(endDate.toDate()) : null,
    reservationDayPeriod,
    reservationMinLength,
    employeeId: employeeId || null,
  };
};

export const onScheduleRead = ({ commerceId, selectedDate, employeeId }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  try {
    const schedule = await scheduleRead({ commerceId, selectedDate, employeeId });

    if (schedule) {
      dispatch({ type: ON_SCHEDULE_READ, payload: schedule });
      dispatch({ type: ON_ACTIVE_SCHEDULES_READ, payload: [schedule] });
    } else {
      dispatch({ type: ON_SCHEDULE_READ_EMPTY });
    }
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_READ_FAIL });
  }
};

export const onEmployeesScheduleRead = ({ commerceId, selectedDate }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  const db = firebase.firestore();
  const schedules = [];

  db.collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null)
    .get()
    .then(snapshot => {
      let index = 0;

      snapshot.forEach(async employee => {
        const employeeId = employee.id;
        const { firstName, lastName } = employee.data();

        try {
          const schedule = await scheduleRead({ commerceId, selectedDate, employeeId });
          if (schedule) {
            schedules.push({
              ...schedule,
              employeeName: `${firstName} ${lastName}`,
            });
          }

          index++;

          if (index === snapshot.size) {
            dispatch({ type: ON_ACTIVE_SCHEDULES_READ, payload: schedules });
          }
        } catch (error) {
          dispatch({ type: ON_SCHEDULE_READ_FAIL });
        }
      });
    })
    .catch(error => dispatch({ type: ON_SCHEDULE_READ_FAIL }));
};

const scheduleRead = async ({ commerceId, selectedDate, employeeId }) => {
  const db = firebase.firestore();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  let schedule;
  let snapshot;

  try {
    // reading schedule
    snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '>', selectedDate.toDate())
      .orderBy('endDate')
      .get();

    if (snapshot.empty) {
      snapshot = await schedulesRef
        .where('softDelete', '==', null)
        .where('endDate', '==', null)
        .get();
    }

    snapshot.forEach(doc => {
      if (
        moment(doc.data().startDate.toDate()) <= selectedDate &&
        (!employeeId || doc.data().employeeId === employeeId)
      ) {
        schedule = formatScheduleDoc({ id: doc.id, ...doc.data() });
      }
    });

    if (!schedule) {
      return schedule;
    }

    // reading schedule cards
    snapshot = await db.collection(`Commerces/${commerceId}/Schedules/${schedule.id}/WorkShifts`).get();

    let cards = [];
    let selectedDays = [];

    snapshot.forEach(doc => {
      cards.push({ ...doc.data(), id: parseInt(doc.id) });
      selectedDays = [...selectedDays, ...doc.data().days];
    });

    return { ...schedule, cards, selectedDays };
  } catch (error) {
    return error;
  }
};

export const onActiveSchedulesRead = ({ commerceId, date, employeeId }) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_READING });

  const db = firebase.firestore();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  const schedules = [];

  try {
    // reading active schedules
    let snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '>=', date.toDate())
      .orderBy('endDate')
      .get();

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        if (!employeeId || doc.data().employeeId === employeeId)
          schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() }));
      });
    }

    snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '==', null)
      .get();

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        if (!employeeId || doc.data().employeeId === employeeId)
          schedules.push(formatScheduleDoc({ id: doc.id, ...doc.data() }));
      });
    }

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
    dispatch({ type: ON_SCHEDULE_READ_FAIL });
  }
};

export const onScheduleUpdate = scheduleData => async dispatch => {
  dispatch({ type: ON_SCHEDULE_CREATING });

  const {
    commerceId,
    scheduleId,
    cards,
    reservationMinLength,
    reservationDayPeriod,
    reservationMinCancelTime,
    startDate,
    endDate,
    schedules,
    reservationsToCancel,
    employeeId,
  } = scheduleData;

  const db = firebase.firestore();
  const batch = db.batch();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);

  schedules.forEach(schedule => {
    if (schedule.startDate < startDate && (!schedule.endDate || startDate < schedule.endDate)) {
      // si se superpone con un schedule que inicia antes, este último termina donde inicia el nuevo
      batch.update(schedulesRef.doc(schedule.id), {
        endDate: startDate.toDate(),
      });
    }

    if (schedule.startDate >= startDate && (!endDate || (schedule.endDate && schedule.endDate <= endDate))) {
      if (schedule.id === scheduleId) {
        // el schedule que se está modificando se elimina porque después se crea de nuevo
        batch.delete(schedulesRef.doc(schedule.id));
        // al eliminarlo hace falta también eliminar las subcolecciones
        schedule.cards.forEach(card => {
          const cardRef = schedulesRef.doc(`${schedule.id}/WorkShifts/${card.id}`);
          batch.delete(cardRef);
        });
      } else {
        // si un schedule anterior queda dentro del periodo de vigencia del nuevo,
        // se le hace una baja lógica
        batch.update(schedulesRef.doc(schedule.id), { softDelete: new Date() });
      }
    }

    if (
      endDate &&
      endDate > schedule.startDate &&
      (!schedule.endDate || (endDate && endDate < schedule.endDate)) &&
      schedule.startDate >= startDate
    ) {
      // si se superpone con un schedule que esta después, este último inicia donde termina el nuevo
      batch.update(schedulesRef.doc(schedule.id), {
        startDate: endDate.toDate(),
      });
    }
  });

  try {
    let newScheduleObj = {
      startDate: startDate.toDate(),
      endDate: endDate ? endDate.toDate() : null,
      softDelete: null,
      reservationMinLength,
      reservationDayPeriod,
      reservationMinCancelTime,
    };

    if (employeeId) {
      newScheduleObj = { ...newScheduleObj, employeeId };
    }

    // new schedule creation
    const newSchedule = await db.collection(`Commerces/${commerceId}/Schedules/`).add(newScheduleObj);

    cards.forEach(card => {
      const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

      const cardRef = schedulesRef.doc(`${newSchedule.id}/WorkShifts/${card.id}`);
      batch.set(cardRef, {
        days,
        firstShiftStart,
        firstShiftEnd,
        secondShiftStart,
        secondShiftEnd,
      });
    });

    // reservations cancel
    await onReservationsCancel(db, batch, commerceId, reservationsToCancel);

    await batch.commit();

    reservationsToCancel.forEach(res => {
      onClientNotificationSend(res.notification, res.clientId, commerceId);
    });

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
    if (endDate <= schedule.startDate) {
      // si se está elimiando un schedule que no estaba en vigencia todavía sin reservas o
      // cancelando las reservas si es que tenía, se le hace una baja lógica
      batch.update(scheduleRef, { softDelete: new Date() });
    } else {
      // si se está eliminando un schedule que ya estaba en vigencia o uno que tiene reservas
      // sin cancelarlas, se le establece una fecha de fin de vigencia lo más pronto posible
      batch.update(scheduleRef, { endDate: endDate.toDate() });
    }

    // reservations cancel
    await onReservationsCancel(db, batch, commerceId, reservationsToCancel);

    await batch.commit();

    reservationsToCancel.forEach(res => {
      onClientNotificationSend(res.notification, res.clientId, commerceId);
    });

    dispatch({ type: ON_SCHEDULE_CREATED });
    return true;
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
    return false;
  }
};

export const onScheduleConfigurationSave = (
  { reservationDayPeriod, reservationMinCancelTime, commerceId, date },
  navigation
) => async dispatch => {
  dispatch({ type: ON_SCHEDULE_CONFIG_UPDATING });

  const db = firebase.firestore();
  const batch = db.batch();
  const schedulesRef = db.collection(`Commerces/${commerceId}/Schedules`);
  const updateObj = { reservationDayPeriod, reservationMinCancelTime };

  try {
    let snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '>=', date.toDate())
      .orderBy('endDate')
      .get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => batch.update(doc.ref, updateObj));
    }

    snapshot = await schedulesRef
      .where('softDelete', '==', null)
      .where('endDate', '==', null)
      .get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => batch.update(doc.ref, updateObj));
    }

    await batch.commit();

    dispatch({ type: ON_SCHEDULE_CONFIG_UPDATED });
    navigation.goBack();
  } catch (error) {
    dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
  }
};
