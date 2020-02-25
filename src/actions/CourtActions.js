import firebase from 'firebase/app';
import 'firebase/firestore';
import moment from 'moment';
import { onReservationsCancel } from './ReservationsListActions';
import { onClientNotificationSend } from './NotificationActions';
import { NOTIFICATION_TYPES } from '../constants';
import {
  ON_COURT_VALUE_CHANGE,
  ON_COURT_FORM_OPEN,
  ON_COURT_CREATE,
  ON_COURT_FORM_SUBMIT,
  ON_COURT_EXISTS,
  ON_COURT_READING,
  ON_COURT_READ,
  ON_COURT_DELETE,
  ON_COURT_UPDATE,
  COMMERCE_COURT_TYPES_READ,
  COMMERCE_COURT_TYPES_READING,
  COMMERCE_COURT_TYPES_READ_FAIL
} from './types';

export const onCourtValueChange = payload => {
  return { type: ON_COURT_VALUE_CHANGE, payload };
};

export const onCourtFormOpen = () => {
  return { type: ON_COURT_FORM_OPEN };
};

export const onCourtAndGroundTypesRead = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection('CourtType')
      .get()
      .then(querySnapshot => {
        const courts = [];
        const grounds = [];
        let i = 0;
        querySnapshot.forEach(doc => {
          courts.push({ value: doc.id, label: doc.id, key: i });

          const ground = [];
          doc.data().groundType.forEach((value, j) => {
            ground.push({ value, label: value, key: j });
          });

          grounds.push(ground);

          i++;
        });

        dispatch({ type: ON_COURT_VALUE_CHANGE, payload: { courts, grounds } });
      });
  };
};

export const onCourtCreate = (
  { name, description, court, ground, price, lightPrice, lightHour, disabledFrom, disabledTo, commerceId },
  navigation
) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COURT_FORM_SUBMIT });
    db.collection(`Commerces/${commerceId}/Courts`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          dispatch({ type: ON_COURT_EXISTS });
        } else {
          db.collection(`Commerces/${commerceId}/Courts`)
            .add({
              name,
              description,
              court,
              ground,
              price,
              lightPrice,
              lightHour,
              disabledFrom: disabledFrom ? disabledFrom.toDate() : null,
              disabledTo: disabledTo ? disabledTo.toDate() : null,
              softDelete: null,

              // este campo lo dejo por ahora para que las consultas que tienen indexado este campo sigan funcionando
              // pero no se usa más, una vez que todos estemos en la nueva versión hay que borrarlo
              courtState: true
            })
            .then(() => {
              dispatch({ type: ON_COURT_CREATE });
              navigation.goBack();
            });
        }
      });
  };
};

export const isCourtDisabledOnSlot = (court, slot) => {
  // esta no es una action pero la clavé acá porque la uso en varios componentes
  // y no me parecía ponerla en utils, de última vermos donde ubicarla
  const { disabledTo, disabledFrom } = court;
  const { startDate, endDate } = slot;

  if (disabledFrom) {
    return (
      ((!disabledTo || disabledTo >= endDate) && disabledFrom < endDate) ||
      (disabledTo && disabledTo < endDate && disabledTo > startDate)
    );
  }

  return false;
};

const formatCourt = doc => {
  return {
    ...doc.data(),
    id: doc.id,
    disabledFrom: doc.data().disabledFrom ? moment(doc.data().disabledFrom.toDate()) : null,
    disabledTo: doc.data().disabledTo ? moment(doc.data().disabledTo.toDate()) : null
  };
};

export const onCourtsRead = commerceId => dispatch => {
  dispatch({ type: ON_COURT_READING });

  const db = firebase.firestore();

  return (
    db
      .collection(`Commerces/${commerceId}/Courts`)
      .where('softDelete', '==', null)
      // .orderBy('disabledFrom', 'asc') // necesita que todos los courts tengan ese campo disabledFrom
      .orderBy('courtState', 'desc') // después se borra este campo
      .orderBy('court', 'asc')
      .orderBy('name', 'asc')
      .onSnapshot(snapshot => {
        const courts = [];
        snapshot.forEach(doc => courts.push(formatCourt(doc)));
        dispatch({ type: ON_COURT_READ, payload: courts });
      })
  );
};

export const onCourtDelete = ({ id, commerceId, reservationsToCancel }) => async dispatch => {
  const db = firebase.firestore();
  const batch = db.batch();

  try {
    batch.update(db.doc(`Commerces/${commerceId}/Courts/${id}`), { softDelete: new Date() });

    // reservations cancel
    await onReservationsCancel(db, batch, commerceId, reservationsToCancel);

    await batch.commit();

    reservationsToCancel.forEach(res => {
      if (res.clientId)
        onClientNotificationSend(res.notification, res.clientId, commerceId, NOTIFICATION_TYPES.NOTIFICATION);
    });

    dispatch({ type: ON_COURT_DELETE });
  } catch (error) {
    console.error(error);
  }
};

export const onCourtUpdate = (courtData, navigation) => async dispatch => {
  dispatch({ type: ON_COURT_FORM_SUBMIT });

  const {
    id,
    name,
    description,
    court,
    ground,
    price,
    lightPrice,
    lightHour,
    commerceId,
    disabledFrom,
    disabledTo,
    reservationsToCancel
  } = courtData;

  const db = firebase.firestore();
  const batch = db.batch();
  const courtsRef = db.collection(`Commerces/${commerceId}/Courts`);

  try {
    const snapshot = await courtsRef
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get();

    if (!snapshot.empty && snapshot.docs[0].id !== id) {
      return dispatch({ type: ON_COURT_EXISTS });
    }

    batch.update(courtsRef.doc(id), {
      name,
      description,
      court,
      ground,
      price,
      lightPrice,
      lightHour,
      disabledFrom: disabledFrom ? disabledFrom.toDate() : null,
      disabledTo: disabledTo ? disabledTo.toDate() : null
    });

    // reservations cancel
    await onReservationsCancel(db, batch, commerceId, reservationsToCancel);

    await batch.commit();

    reservationsToCancel.forEach(res => {
      if (res.clientId)
        onClientNotificationSend(res.notification, res.clientId, commerceId, NOTIFICATION_TYPES.NOTIFICATION);
    });

    dispatch({ type: ON_COURT_UPDATE });
    navigation.goBack();
  } catch (error) {
    console.error(error);
  }
};

export const onCommerceCourtTypesRead = ({ commerceId, loadingType }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COMMERCE_COURT_TYPES_READING, payload: loadingType });

    db.collection(`Commerces/${commerceId}/Courts`)
      .where('softDelete', '==', null)
      .get()
      .then(snapshot => {
        const courtTypes = [];

        snapshot.forEach(doc => {
          if (!courtTypes.includes(doc.data().court)) {
            courtTypes.push(doc.data().court);
          }
        });

        db.collection('CourtType')
          .get()
          .then(snapshot => {
            const courtTypesList = [];

            snapshot.forEach(doc => {
              if (courtTypes.includes(doc.id)) {
                courtTypesList.push({ name: doc.id, image: doc.data().image });
              }
            });

            dispatch({
              type: COMMERCE_COURT_TYPES_READ,
              payload: courtTypesList
            });
          })
          .catch(error => dispatch({ type: COMMERCE_COURT_TYPES_READ_FAIL }));
      })
      .catch(error => dispatch({ type: COMMERCE_COURT_TYPES_READ_FAIL }));
  };
};

export const onCommerceCourtsReadByType = ({ commerceId, courtType }) => dispatch => {
  dispatch({ type: ON_COURT_READING, payload: 'loading' });

  const db = firebase.firestore();

  return (
    db
      .collection(`Commerces/${commerceId}/Courts`)
      .where('softDelete', '==', null)
      .where('court', '==', courtType)
      // .orderBy('disabledFrom', 'asc') // necesita que todos los courts tengan ese campo disabledFrom
      .orderBy('name', 'asc')
      .onSnapshot(snapshot => {
        const courts = [];
        snapshot.forEach(doc => courts.push(formatCourt(doc)));
        dispatch({ type: ON_COURT_READ, payload: courts });
      })
  );
};
