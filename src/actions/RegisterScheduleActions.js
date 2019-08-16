import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT,
  ON_SCHEDULE_CARD_VALUE_CHANGE,
  ON_SCHEDULE_CARD_DELETE,
  ON_SCHEDULE_SHIFTS_READ,
  ON_SCHEDULE_SHIFTS_READING
} from './types';

export const onScheduleValueChange = ({ prop, value }) => {
  return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop, value } };
};

export const onScheduleCardValueChange = card => {
  return { type: ON_SCHEDULE_CARD_VALUE_CHANGE, payload: card };
}

export const onScheduleCardDelete = cardId => {
  return { type: ON_SCHEDULE_CARD_DELETE, payload: cardId };
}

export const onScheduleFormOpen = () => {
  return { type: ON_SCHEDULE_FORM_OPEN };
};

export const onScheduleRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_SHIFTS_READING });

    //ruta hardcodeada para probar
    db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0/WorkShifts').get()
    .then(snapshot => {
      var cards = [];
      var selectedDays = [];
  
      snapshot.forEach(doc => {
        const { id, days, firstShiftStart, firstShiftEnd } = doc.data();

        var card = {
          id: id,
          days: days,
          firstOpen: firstShiftStart,
          firstClose: firstShiftEnd
        };
  
        if (doc.data().secondShiftStart && doc.data().secondShiftEnd) {
          card = { ...card, secondOpen: doc.data().secondShiftStart, secondClose: doc.data().secondShiftEnd };
        }
  
        cards.push(card);
        selectedDays.concat(card.days);
      });

      dispatch({ type: ON_SCHEDULE_SHIFTS_READ, payload: { cards, selectedDays } });
    })
  }
}

export const onScheduleCreate = (cards) => {
  const db = firebase.firestore();
  var batch = db.batch();

  var cards = cards.map(card => formatCards(card));

  cards.forEach(card => {
    //ruta hardcodeada para probar
    var ref = db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/0/WorkShifts').doc(`${card.id}`);
    batch.set(ref, card);
  })

  batch.commit().then(() => console.log('Escrito perri'));

  return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop: 'nada', value: '' } };
}

formatCards = card => {
  var newCard = {
    id: card.id,
    firstShiftStart: card.firstOpen,
    firstShiftEnd: card.firstClose,
    days: card.days
  };

  if (card.secondOpen && card.secondClose) {
    newCard = { ...newCard, secondShiftStart: card.secondOpen, secondShiftEnd: card.secondClose };
  }

  return newCard;
}

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
    var dayShifts = [{ shiftStart: card.firstOpen, shiftEnd: card.firstClose }];

    if (card.secondOpen && card.secondClose) {
      dayShifts.push({ shiftStart: card.secondOpen, shiftEnd: card.secondClose })
    }

    return { dayId: day, shifts: dayShifts };
  });
}
*/