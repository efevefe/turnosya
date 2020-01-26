import firebase from 'firebase/app'
import 'firebase/firestore'
import { formatReservation } from './ReservationsListActions'
import { AREAS } from '../constants'
import { onCommerceNotificationSend } from './NotificationActions'
import {
  ON_CLIENT_RESERVATIONS_READ,
  ON_CLIENT_RESERVATIONS_READING,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL,
  ON_CLIENT_RESERVATION_CANCELING,
} from './types'

export const onClientReservationsListRead = () => dispatch => {
  dispatch({ type: ON_CLIENT_RESERVATIONS_READING })

  const { currentUser } = firebase.auth()
  const db = firebase.firestore()

  return db
    .collection(`Profiles/${currentUser.uid}/Reservations`)
    .where('state', '==', null)
    .orderBy('startDate', 'desc')
    .limit(50) // lo puse por ahora para no buscar todas al pedo, habria que ver de ir cargando mas a medida que se scrollea
    .onSnapshot(snapshot => {
      const reservations = []

      if (snapshot.empty) {
        return dispatch({
          type: ON_CLIENT_RESERVATIONS_READ,
          payload: reservations,
        })
      }

      snapshot.forEach(async res => {
        const { commerceId, areaId, serviceId, employeeId, courtId } = res.data()
        let service,
          employee,
          court = null

        try {
          const commerce = await db.doc(`Commerces/${commerceId}`).get()

          if (areaId === AREAS.hairdressers) {
            service = await db.doc(`Commerces/${commerceId}/Services/${serviceId}`).get()
            employee = await db.doc(`Commerces/${commerceId}/Employees/${employeeId}`).get()
            // } else if (areaId === AREAS.sports) { // no anda para reservas viejas que no tenian el areaId
          } else {
            court = await db.doc(`Commerces/${commerceId}/Courts/${courtId}`).get()
          }

          reservations.push(formatReservation({ res, commerce, service, court, employee }))

          if (snapshot.size === reservations.length) {
            dispatch({
              type: ON_CLIENT_RESERVATIONS_READ,
              payload: reservations.sort((a, b) => a.startDate - b.startDate),
            })
          }
        } catch (error) {
          console.error(error)
        }
      })
    })
}

export const onClientReservationCancel = ({ reservationId, commerceId, navigation, notification }) => {
  const { currentUser } = firebase.auth()
  const db = firebase.firestore()
  const batch = db.batch()

  return dispatch => {
    dispatch({ type: ON_CLIENT_RESERVATION_CANCELING }),
      db
        .doc(`ReservationStates/canceled`)
        .get()
        .then(stateDoc => {
          const cancellationData = {
            state: { id: stateDoc.id, name: stateDoc.data().name },
            cancellationDate: new Date(),
          }

          batch.update(db.doc(`Profiles/${currentUser.uid}/Reservations/${reservationId}`), cancellationData)
          batch.update(db.doc(`Commerces/${commerceId}/Reservations/${reservationId}`), cancellationData)

          batch
            .commit()
            .then(() => {
              onCommerceNotificationSend(notification, commerceId, notification.employeeId)

              dispatch({ type: ON_CLIENT_RESERVATION_CANCEL })
              navigation.goBack()
            })
            .catch(() => {
              dispatch({
                type: ON_CLIENT_RESERVATION_CANCEL_FAIL,
              })
            })
        })
        .catch(() => {
          dispatch({
            type: ON_CLIENT_RESERVATION_CANCEL_FAIL,
          })
        })
  }
}
