import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_CLIENT_DATA_VALUE_CHANGE,
  ON_USER_REGISTER,
  ON_USER_REGISTER_SUCCESS,
  ON_USER_REGISTER_FAIL,
  ON_USER_READING,
  ON_USER_READ,
  ON_USER_UPDATING,
  ON_USER_UPDATED,
  ON_USER_UPDATE_FAIL,
  ON_USER_READ_FAIL,
  ON_USER_DELETING,
  ON_USER_DELETED,
  ON_USER_DELETE_FAIL,
  ON_REAUTH_FAIL,
  ON_REAUTH_SUCCESS,
  ON_EMAIL_VERIFY_REMINDED,
  ON_REGISTER_FORM_OPEN,
  ON_WORKPLACES_READ,
  ON_USER_PASSWORD_UPDATE
} from './types';
import { userReauthenticate } from './AuthActions';

export const onClientDataValueChange = payload => {
  return { type: ON_CLIENT_DATA_VALUE_CHANGE, payload };
};

export const onRegisterFormOpen = () => {
  return { type: ON_REGISTER_FORM_OPEN };
};

export const onUserRegister = ({
  email,
  password,
  firstName,
  lastName,
  phone
}) => {
  return dispatch => {
    dispatch({ type: ON_USER_REGISTER });

    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        db.collection('Profiles')
          .doc(user.user.uid)
          .set({
            firstName,
            lastName,
            email,
            phone,
            commerceId: null,
            softDelete: null
          })
          .then(() => {
            dispatch({ type: ON_USER_REGISTER_SUCCESS, payload: user });
            dispatch({ type: ON_EMAIL_VERIFY_REMINDED });
            user.user.sendEmailVerification();
          })
          .catch(error =>
            dispatch({ type: ON_USER_REGISTER_FAIL, payload: error.message })
          );
      })
      .catch(error =>
        dispatch({ type: ON_USER_REGISTER_FAIL, payload: error.message })
      );
  };
};

export const onUserRead = (clientId = firebase.auth().currentUser.uid) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_READING });

    db.doc(`Profiles/${clientId}`)
      .get()
      .then(doc =>
        dispatch({
          type: ON_USER_READ,
          payload: { ...doc.data(), clientId: doc.id }
        })
      )
      .catch(error => dispatch({ type: ON_USER_READ_FAIL }));
  };
};

export const onUserUpdate = ({
  firstName,
  lastName,
  phone,
  profilePicture
}) => async dispatch => {
  dispatch({ type: ON_USER_UPDATING });

  const { currentUser } = firebase.auth();

  let url = null;

  try {
    if (profilePicture instanceof Blob) {
      const snapshot = await firebase
        .storage()
        .ref(`Users/${currentUser.uid}`)
        .child(`${currentUser.uid}-ProfilePicture`)
        .put(profilePicture);

      url = await snapshot.ref.getDownloadURL();
    }

    await firebase
      .firestore()
      .doc(`Profiles/${currentUser.uid}`)
      .update({
        firstName,
        lastName,
        phone,
        profilePicture: url ? url : profilePicture
      });

    dispatch({ type: ON_USER_UPDATED, payload: url ? url : profilePicture });
  } catch (error) {
    dispatch({ type: ON_USER_UPDATE_FAIL });
  } finally {
    profilePicture.close();
  }
};

export const onUserDelete = password => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_DELETING });

    userReauthenticate(password)
      .then(() => {
        dispatch({ type: ON_REAUTH_SUCCESS });

        db.doc(`Profiles/${currentUser.uid}`)
          .update({ softDelete: new Date() })
          .then(() => {
            currentUser
              .delete()
              .then(() => {
                dispatch({ type: ON_USER_DELETED });
              })
              .catch(error => dispatch({ type: ON_USER_DELETE_FAIL }));
          })
          .catch(error => dispatch({ type: ON_USER_DELETE_FAIL }));
      })
      .catch(error => {
        dispatch({ type: ON_REAUTH_FAIL });
        dispatch({ type: ON_USER_DELETE_FAIL });
      });
  };
};

export const readUserWorkplaces = () => dispatch => {
  const db = firebase.firestore();
  const clientId = firebase.auth().currentUser.uid;

  let workplaces = [];

  db.collection(`Profiles/${clientId}/Workplaces`)
    .where('softDelete', '==', null)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc =>
        workplaces.push({
          commerceId: doc.data().commerceId,
          name: doc.data().name
        })
      );
      dispatch({ type: ON_WORKPLACES_READ, payload: workplaces });
    });
};

export const onUserPasswordUpdate = ({ password, newPassword }, navigation) => {
  const { currentUser } = firebase.auth();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    userReauthenticate(password)
      .then(() => {
        currentUser
          .updatePassword(newPassword)
          .then(() => {
            dispatch({ type: ON_REAUTH_SUCCESS });
            dispatch({ type: ON_USER_PASSWORD_UPDATE });
            navigation.goBack();
          })
          .catch(error => {
            dispatch({ type: ON_USER_UPDATE_FAIL });
            dispatch({ type: ON_REAUTH_SUCCESS });
          });
      })
      .catch(error => {
        dispatch({ type: ON_REAUTH_FAIL });
        dispatch({ type: ON_USER_UPDATE_FAIL });
      });
  };
};
