import firebase from 'firebase';

import { ON_REGISTER } from './types';

export const onRegister = ({ email, password }) => {
  return dispatch => {
    console.log(email);

    dispatch({ type: ON_REGISTER });
    console.log(email);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Bienvenidooo perriii');
      })
      .catch(err => {
        console.log('errorr');
      });
  };
};
