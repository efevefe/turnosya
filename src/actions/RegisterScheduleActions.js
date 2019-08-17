import firebase from 'firebase/app';
import 'firebase/firestore';
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
  ON_SCHEDULE_CONFIG_UPDATED
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

export const onScheduleRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_READING });

    //ruta hardcodeada para probar
    db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0/WorkShifts')
      .get()
      .then(snapshot => {
        var cards = [];
        var selectedDays = [];

        snapshot.forEach(doc => {
          cards.push({ ...doc.data(), id: doc.id });
          selectedDays = selectedDays.concat(doc.data().days);
        });

        dispatch({
          type: ON_SCHEDULE_READ,
          payload: { cards, selectedDays }
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_SCHEDULE_READ_FAIL });
      });
  };
};

export const onScheduleCreate = cards => {
  const db = firebase.firestore();
  var batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CREATING });

    cards.forEach(card => {
      const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;
      //ruta hardcodeada para probar
      var ref = db
        .collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0/WorkShifts')
        .doc(`${card.id}`);
      batch.set(ref, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
    });

    var scheduleRef = db.doc('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0');
    batch.update(scheduleRef, { startDate: new Date(), endDate: null });

    batch.commit()
      .then(() => dispatch({ type: ON_SCHEDULE_CREATED }))
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
      });
  }
};

/*
export const onScheduleCreate = (cards) => {
  const db = firebase.firestore();
  var batch = db.batch();

  var cards = cards.map(card => formatCards(card));

  cards.forEach(card => {
    card.forEach(day => {
      var ref = db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0/Dias').doc(`${day.dayId}`);
      batch.set(ref, day);
    })
  })

  batch.commit().then(() => console.log('Escrito perri'));

  return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop: 'nada', value: '' } };
}
*/

/*
formatCards = card => {
  return card.days.map(day => {
    var dayShifts = [{ shiftStart: card.firstShiftStart, shiftEnd: card.firstShiftEnd }];

    if (card.secondShiftStart && card.secondShiftEnd) {
      dayShifts.push({ shiftStart: card.secondShiftStart, shiftEnd: card.secondShiftEnd })
    }

    return { dayId: day, shifts: dayShifts };
  });
}
*/

export const onScheduleConfigSave = (
  reservationMinLength,
  reservationDayPeriod,
  commerceId
) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CONFIG_UPDATING });

    // ruta hardcodeada pq nico tambien la hardcodeo asi probamos
    // esto en realidad seria `Commerces/${commerceId}/Schedules/X`
    db.doc('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0')
      .set({ reservationMinLength, reservationDayPeriod }, { merge: true })
      .then(() => dispatch({ type: ON_SCHEDULE_CONFIG_UPDATED }))
      .catch(() => console.log('error'));
  };
};
