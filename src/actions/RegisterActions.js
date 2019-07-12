import firebase from 'firebase/app';
import 'firebase/firestore';

import { 
  ON_REGISTER_VALUE_CHANGE, 
  ON_REGISTER, 
  ON_REGISTER_SUCCESS, 
  ON_REGISTER_FAIL, 
  ON_USER_READING,
  ON_USER_READ, 
  ON_USER_UPDATING,
  ON_USER_UPDATED
} from './types';

export const onRegisterValueChange = ({ prop, value }) => {
  return { type: ON_REGISTER_VALUE_CHANGE, payload: { prop, value } };
};

export const onRegister = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_REGISTER });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: ON_REGISTER_SUCCESS, payload: user }))
      .catch(error => dispatch({ type: ON_REGISTER_FAIL, payload: error.message }));
  };
};

export const onUserRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_READING });

    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => dispatch({ type: ON_USER_READ, payload: doc.data() }))
      .catch(error => console.log(error));
  }
}

export const onUserUpdate = ({ firstName, lastName, phone }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    db.doc(`Profiles/${currentUser.uid}`)
      .update({ firstName, lastName, phone })
      .then(dispatch({ type: ON_USER_UPDATED}))
      .catch(error => console.log(error));
  }
}
