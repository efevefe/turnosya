import firebase from 'firebase';

import { ON_LOGIN, ON_LOGIN_SUCCESS, ON_LOGIN_FAIL } from './types';

export const onLogin = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
  };
};

export const onLoginFacebook = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });
    Expo.Facebook.logInWithReadPermissionsAsync('308666633372616', {
      permissions: ['public_profile']
    })
      .then(({ type, token }) => {
        if (type === 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential( token );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
            .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
  };
};
