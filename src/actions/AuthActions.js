import firebase from 'firebase';

import {
  ON_LOGIN_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGIN_FACEBOOK,
  ON_LOGIN_GOOGLE
} from './types';

export const onLoginValueChange = ({ prop, value }) => {
  return { type: ON_LOGIN_VALUE_CHANGE, payload: { prop, value } };
};

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
            .then(({ user, additionalUserInfo }) => {
              const { first_name, last_name } = additionalUserInfo.profile;

              const userData = {
                firstName: first_name,
                lastName: last_name,
                email: user.email,
                phone: user.phoneNumber,
                /*picture: additionalUserInfo.profile.picture.data.url*/
                softDelete: null
              };

              if (additionalUserInfo.isNewUser) {
                let db = firebase.firestore();

                db.collection('Profiles')
                  .doc(user.uid)
                  .set(userData)
                  .then(() =>
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData })
                  );
              } else dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
            })
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
    dispatch({ type: ON_LOGIN_GOOGLE });

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
            .then(({ user, additionalUserInfo }) => {
              const { given_name, family_name } = additionalUserInfo.profile;

              const userData = {
                firstName: given_name,
                lastName: family_name,
                email: user.email,
                phone: user.phoneNumber,
                /*picture: additionalUserInfo.profile.picture.data.url*/
                softDelete: null
              };
              if (additionalUserInfo.isNewUser) {
                let db = firebase.firestore();

                db.collection('Profiles')
                  .doc(user.uid)
                  .set(userData)
                  .then(() =>
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData })
                  );
              } else dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
            })
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
    dispatch({ type: ON_LOGOUT });

    firebase
      .auth()
      .signOut()
      .then(() => dispatch({ type: ON_LOGOUT_SUCCESS }))
      .catch(() => dispatch({ type: ON_LOGIN_FAIL }));
  };
};
