import firebase from 'firebase';

import { ON_LOGIN, ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT, ON_LOGOUT_SUCCESS, ON_LOGIN_FACEBOOK } from './types';

export const onLogin = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

export const onFacebookLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN_FACEBOOK });

    Expo.Facebook.logInWithReadPermissionsAsync('308666633372616', {
      permissions: ['public_profile', 'email']
    })
      .then(({ type, token }) => {
        if (type === 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            token
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
            .catch(error =>
              dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
            );
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

export const onGoogleLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    Expo.Google.logInAsync({
      iosClientId:
        '425889819253-ojktt4qkb3809old6sfverggu8g0ofh2.apps.googleusercontent.com',
      androidClientId:
        '425889819253-sb80h20d5etvpisi036ugvb6g7o6jkkl.apps.googleusercontent.com',
      scopes: ['profile', 'email']
    })
      .then(({ type, idToken, accessToken }) => {
        if (type === 'success') {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(user => dispatch({ type: ON_LOGIN_SUCCESS, payload: user }))
            .catch(error =>
              dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
            );
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error =>
        dispatch({ type: ON_LOGIN_FAIL, payload: error.message })
      );
  };
};

//no se esta usando por ahora
export const onLogout = () => {
  return dispatch => {
    dispatch({ type: ON_LOGOUT })
    
    firebase.auth().signOut()
    .then(() => dispatch({ type: ON_LOGOUT_SUCCESS }))
    .catch(() => dispatch({ type: ON_LOGIN_FAIL }));
  }
}
