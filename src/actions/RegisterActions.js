import firebase from 'firebase';

import {
  ON_REGISTER_VALUE_CHANGE,
  ON_REGISTER,
  ON_REGISTER_SUCCESS,
  ON_REGISTER_FAIL
} from './types';

export const onRegisterValueChange = ({ prop, value }) => {
  return { type: ON_REGISTER_VALUE_CHANGE, payload: { prop, value } };
};

export const onRegister = ({ email, password, firstName, lastName, phone }) => {
  return dispatch => {
    dispatch({ type: ON_REGISTER });

    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        db.collection('Profiles')
          .doc(user.user.uid)
          .set({ firstName, lastName, email, phone, softDelete: null })
          .then(() => dispatch({ type: ON_REGISTER_SUCCESS, payload: user }))
          .catch(error =>
            dispatch({ type: ON_REGISTER_FAIL, payload: error.message })
          );
      })
      .catch(error =>
        dispatch({ type: ON_REGISTER_FAIL, payload: error.message })
      );
  };
};
