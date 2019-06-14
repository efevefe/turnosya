import firebase from 'firebase';

import { ON_LOGIN, ON_LOGIN_SUCCESS, ON_LOGIN_FAIL } from './types';

export const onLogin = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error }));
  };
};
