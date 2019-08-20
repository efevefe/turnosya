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

export const onScheduleRead = commerceId => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_READING });

    db.collection(`Commerces/${commerceId}/Schedules`)
      .where('endDate', '==', null)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return dispatch({ type: ON_SCHEDULE_READ_EMPTY });
        }

        snapshot.forEach(doc => {
          var { reservationDayPeriod, reservationMinLength } = doc.data();

          db.collection(`Commerces/${commerceId}/Schedules/${doc.id}/WorkShifts`)
            .get()
            .then(snapshot => {
              if (snapshot.empty) {
                return dispatch({ type: ON_SCHEDULE_READ_EMPTY });
              }

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

/*
export const onScheduleCreate = cards => {
  //ESTA FUNCION ES PARA UPDATEAR LOS SCHEDULES SIN TENER QUE BORRAR Y VOLVER A ESCRIBIR
  const db = firebase.firestore();
  var batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CREATING });

    //rutas hardcodeadas para probar
    db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/')
      .where('endDate', '==', null)
      .get()
      .then(snapshot => {
        snapshot.forEach(oldSchedule => {
          batch.update(oldSchedule.ref, { endDate: new Date() });

          db.collection('Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/')
            .add({ startDate: new Date(), endDate: null })
            .then(scheduleRef => {
              cards.forEach(card => {
                const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;
                
                var ref = db
                  .collection(`Commerces/D0iAxKlOYbjSHwNqZqGY/Schedules/${scheduleRef.id}/WorkShifts`)
                  .doc(`${card.id}`);
                batch.set(ref, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
              });

              batch.commit()
                .then(() => dispatch({ type: ON_SCHEDULE_CREATED }))
                .catch(error => {
                  console.log(error);
                  dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
                });
            })
            .catch(error => {
              console.log(error);
              dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
            });
        })
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
      });
  }
};
*/

export const onScheduleCreate = ({ cards, commerceId }, navigation) => {
  //ESTE METODO BORRA LOS HORARIOS DE ATENCION Y LOS CARGA DE NUEVO, SINO UN VIAJE ACTUALIZAR CUANDO BORRAS UN CARD
  const db = firebase.firestore();
  var batch = db.batch();

  return dispatch => {
    dispatch({ type: ON_SCHEDULE_CREATING });

    db.doc(`Commerces/${commerceId}/Schedules/0`)
      .set({ startDate: new Date(), endDate: null }, { merge: true })
      .then(() => {
        db.collection(`Commerces/${commerceId}/Schedules/0/WorkShifts`)
          .get()
          .then(snapshot => {
            snapshot.forEach(shift => {
              batch.delete(shift.ref);
            });

            cards.forEach(card => {
              const { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd } = card;

              var ref = db
                .collection(`Commerces/${commerceId}/Schedules/0/WorkShifts`)
                .doc(`${card.id}`);
              batch.set(ref, { days, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd });
            });

            batch.commit()
              .then(() => {
                navigation.navigate('calendar');
                dispatch({ type: ON_SCHEDULE_CREATED });
              })
              .catch(error => {
                console.log(error);
                dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
              });
          })
          .catch(error => {
            console.log(error);
            dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
          });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_SCHEDULE_CREATE_FAIL });
      });
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
      })
      .catch(error => console.log(error));
  };
};
