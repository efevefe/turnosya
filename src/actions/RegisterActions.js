import firebase from 'firebase';

import { ON_REGISTER, ON_REGISTER_SUCCESS, ON_REGISTER_FAIL } from './types';

export const onRegister = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_REGISTER });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: ON_REGISTER_SUCCESS, payload: user }))
      .catch(error => dispatch({ type: ON_REGISTER_FAIL, payload: error }));
  };
};
