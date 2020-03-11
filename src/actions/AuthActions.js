import firebase from 'firebase/app';
import 'firebase/firestore';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import {
  ON_LOGIN_VALUE_CHANGE,
  ON_LOGIN,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAIL,
  ON_LOGOUT,
  ON_LOGOUT_SUCCESS,
  ON_LOGIN_FACEBOOK,
  ON_LOGIN_GOOGLE,
  ON_EMAIL_VERIFY_ASKED,
  ON_EMAIL_VERIFY_REMINDED,
  ON_PASSWORD_RESET_EMAIL_SENDING,
  ON_PASSWORD_RESET_EMAIL_SENT,
  ON_PASSWORD_RESET_EMAIL_FAIL
} from './types';

import getEnvVars from '../../environment';
const { facebookApiKey, facebookPermissions, iosClientId, iosStandaloneAppClientId, androidClientId, androidStandaloneAppClientId, googleScopes } = getEnvVars();
import { onNotificationTokenRegister, onNotificationTokenDelete } from '../actions/NotificationActions';

export const onLoginValueChange = payload => {
  return { type: ON_LOGIN_VALUE_CHANGE, payload };
};

export const sendEmailVefification = () => {
  const { currentUser } = firebase.auth();
  currentUser.sendEmailVerification();

  return { type: ON_EMAIL_VERIFY_ASKED, payload: currentUser.email };
};

export const onLogin = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: ON_LOGIN });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        onNotificationTokenRegister();

        dispatch({ type: ON_LOGIN_SUCCESS, payload: user });

        if (!user.user.emailVerified)
          dispatch({
            type: ON_EMAIL_VERIFY_REMINDED
          });
      })
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
  };
};

export const onFacebookLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN_FACEBOOK });

    Facebook.initializeAsync(facebookApiKey)
      .then(() => {
        Facebook.logInWithReadPermissionsAsync({ permissions: facebookPermissions })
          .then(({ type, token }) => {
            if (type === 'success') {
              const credential = firebase.auth.FacebookAuthProvider.credential(token);
              firebase
                .auth()
                .signInWithCredential(credential)
                .then(({ user, additionalUserInfo }) => {
                  const { first_name, last_name } = additionalUserInfo.profile;
                  onNotificationTokenRegister();

                  const userData = {
                    firstName: first_name,
                    lastName: last_name,
                    email: user.email,
                    phone: user.phoneNumber,
                    profilePicture: additionalUserInfo.profile.picture.data.url,
                    commerceId: null,
                    softDelete: null
                  };

                  if (additionalUserInfo.isNewUser) {
                    const db = firebase.firestore();

                    db.collection('Profiles')
                      .doc(user.uid)
                      .set(userData)
                      .then(() => dispatch({ type: ON_LOGIN_SUCCESS, payload: userData }));
                  } else {
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
                  }
                })
                .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
            } else {
              dispatch({ type: ON_LOGIN_FAIL, payload: '' });
            }
          })
          .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
      })
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
  };
};

export const onGoogleLogin = () => {
  return dispatch => {
    dispatch({ type: ON_LOGIN_GOOGLE });

    Google.logInAsync({ iosClientId, iosStandaloneAppClientId, androidClientId, androidStandaloneAppClientId, scopes: googleScopes })
      .then(({ type, idToken, accessToken }) => {
        if (type === 'success') {
          const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(({ user, additionalUserInfo }) => {
              const { given_name, family_name } = additionalUserInfo.profile;
              onNotificationTokenRegister();

              const userData = {
                firstName: given_name,
                lastName: family_name,
                email: user.email,
                phone: user.phoneNumber,
                profilePicture: additionalUserInfo.profile.picture,
                commerceId: null,
                softDelete: null
              };

              if (additionalUserInfo.isNewUser) {
                let db = firebase.firestore();

                db.collection('Profiles')
                  .doc(user.uid)
                  .set(userData)
                  .then(() => {
                    dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
                  });
              } else {
                () => dispatch({ type: ON_LOGIN_SUCCESS, payload: userData });
              }
            })
            .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
        } else {
          dispatch({ type: ON_LOGIN_FAIL, payload: '' });
        }
      })
      .catch(error => dispatch({ type: ON_LOGIN_FAIL, payload: error.message }));
  };
};

export const onLogout = (commerceId, workplaces) => async dispatch => {
  dispatch({ type: ON_LOGOUT });

  try {
    await onNotificationTokenDelete(commerceId, workplaces);

    firebase
      .auth()
      .signOut()
      .then(() => dispatch({ type: ON_LOGOUT_SUCCESS })) //tira error cuando uso la variable importada
      .catch(() => dispatch({ type: ON_LOGIN_FAIL }));
  } catch (error) {
    return dispatch => dispatch({ type: ON_LOGIN_FAIL });
  }
};

export const onEmailVerifyReminded = () => async dispatch => {
  try {
    const { currentUser } = firebase.auth();
    await currentUser.reload();

    if (!currentUser.emailVerified) dispatch({ type: ON_EMAIL_VERIFY_REMINDED });
  } catch (error) {
    console.error(error);
  }
};

export const onSendPasswordResetEmail = email => async dispatch => {
  dispatch({ type: ON_PASSWORD_RESET_EMAIL_SENDING });

  try {
    await firebase.auth().sendPasswordResetEmail(email);
    dispatch({ type: ON_PASSWORD_RESET_EMAIL_SENT });
    return true;
  } catch (error) {
    dispatch({ type: ON_PASSWORD_RESET_EMAIL_FAIL, payload: error.message });
    return false;
  }
};

export const userReauthenticate = async (password = null) => {
  try {
    const { currentUser } = firebase.auth();
    const provider = currentUser.providerData[0].providerId;
    let credential;

    if (provider == 'password') {
      credential = await firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
    } else if (provider == 'facebook.com') {
      await Facebook.logInWithReadPermissionsAsync(facebookApiKey, {
        permissions: facebookPermissions
      }).then(({ type, token }) => {
        if (type === 'success') {
          credential = firebase.auth.FacebookAuthProvider.credential(token);
        }
      });
    } else if (provider == 'google.com') {
      await Google.logInAsync({ iosClientId, androidClientId, scopes: googleScopes }).then(
        ({ type, idToken, accessToken }) => {
          if (type === 'success') {
            credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
          }
        }
      );
    }

    return currentUser.reauthenticateWithCredential(credential);
  } catch (error) {
    console.error(error);
  }
};
