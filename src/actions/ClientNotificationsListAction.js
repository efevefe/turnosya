import firebase from 'firebase/app'
import 'firebase/firestore'
import {
  ON_CLIENT_NOTIFICATIONS_READ,
  ON_CLIENT_NOTIFICATIONS_READING,
  ON_CLIENT_NOTIFICATIONS_DELETED,
  ON_CLIENT_NOTIFICATIONS_DELETED_FAIL,
} from './types'
import moment from 'moment'

export const onCommerceNotificationsRead = clientId => dispatch => {
  dispatch({ type: ON_CLIENT_NOTIFICATIONS_READING })

  const db = firebase.firestore()
  let notifications = []

  return (
    db
      .collection(`Profiles/${clientId}/Notifications`)
      .where('softDelete', '==', null)
      .limit(50)
      /*     .where('date', '<=', moment().subtract(1,'month').toDate())*/
      .orderBy('date', 'asc')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => notifications.push({ ...doc.data(), id: doc.id }))
        dispatch({
          type: ON_CLIENT_NOTIFICATIONS_READ,
          payload: notifications,
        })
      })
  )
}

//Registra la notificacion como eliminada
export const onCommerceNotificationDelete = ({ clientId, notificationId }) => {
  const db = firebase.firestore()
  return dispatch => {
    db.doc(`Profiles/${clientId}/Notifications/${notificationId}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: ON_CLIENT_NOTIFICATIONS_DELETED }))
  }
}
