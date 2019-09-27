import firebase from 'firebase/app';
import 'firebase/firestore';
import {} from './types';

export const onClientListReservationRead = () => {
    const { currentUser } = firebase.auth();
    var db = firebase.firestore();
  
    return dispatch => {
      //dispatch({ type: ON_USER_READING });
  
      db.collection(`Profiles/${currentUser.uid}/Reservations`)
        .get()
        .then(doc => console.log(doc))
        .catch(error => {
          dispatch({ type: ON_USER_READ_FAIL });
          console.log(error);
        });
    };
  };