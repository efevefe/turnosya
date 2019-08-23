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
  ON_USER_UPDATED,
  ON_USER_UPDATE_FAIL,
  ON_USER_READ_FAIL,
  ON_USER_DELETING,
  ON_USER_DELETED,
  ON_USER_DELETE_FAIL,
  ON_REAUTH_FAIL,
  ON_REAUTH_SUCCESS
} from './types';
import { userReauthenticate } from './AuthActions';

// este se deberia llamar onClientValueChange / onUserValueChange
export const onRegisterValueChange = ({ prop, value }) => {
  return { type: ON_REGISTER_VALUE_CHANGE, payload: { prop, value } };
};

// este se deberia llamar onUserCreate
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
          .set({
            firstName,
            lastName,
            email,
            phone,
            commerceId: null,
            softDelete: null
          })
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

export const onUserRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_READING });

    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => dispatch({ type: ON_USER_READ, payload: doc.data() }))
      .catch(error => {
        dispatch({ type: ON_USER_READ_FAIL });
        console.log(error);
      });
  };
};

export const onUserUpdateNoPicture = ({
  firstName,
  lastName,
  phone,
  profilePicture
}) => {
  // on this function, profilePicture is an URL

  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    db.doc(`Profiles/${currentUser.uid}`)
      .update({ firstName, lastName, phone, profilePicture })
      .then(dispatch({ type: ON_USER_UPDATED, payload: profilePicture }))
      .catch(error => {
        dispatch({ type: ON_USER_UPDATE_FAIL });
        console.log(error);
      });
  };
};

export const onUserUpdateWithPicture = ({
  firstName,
  lastName,
  phone,
  profilePicture
}) => {
  // on this function, profilePicture is a BLOB

  const { currentUser } = firebase.auth();
  var ref = firebase
    .storage()
    .ref(`Users/${currentUser.uid}`)
    .child(`${currentUser.uid}-ProfilePicture`);
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    ref
      .put(profilePicture)
      .then(snapshot => {
        profilePicture.close();
        snapshot.ref
          .getDownloadURL()
          .then(url => {
            db.doc(`Profiles/${currentUser.uid}`)
              .update({ firstName, lastName, phone, profilePicture: url })
              .then(dispatch({ type: ON_USER_UPDATED, payload: url }))
              .catch(error => {
                dispatch({ type: ON_USER_UPDATE_FAIL });
                console.log(error);
              });
          })
          .catch(error => {
            dispatch({ type: ON_USER_UPDATE_FAIL });
            console.log(error);
          });
      })
      .catch(error => {
        profilePicture.close();
        dispatch({ type: ON_USER_UPDATE_FAIL });
        console.log(error);
      });
  };
};

export const onUserDelete = (password) => {
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
              .catch(error => {
                console.log(error);
                dispatch({ type: ON_USER_DELETE_FAIL });
              });
          })
          .catch(error => {
            console.log(error);
            dispatch({ type: ON_USER_DELETE_FAIL });
          });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: ON_REAUTH_FAIL });
        dispatch({ type: ON_USER_DELETE_FAIL });
      });

  }
}