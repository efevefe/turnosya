import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  COMMERCE_READING,
  COMMERCE_READ,
  COMMERCE_FAIL,
  COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_PROFILE_VALUE_CHANGE
} from './types';

export const onComemrceValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_PROFILE_VALUE_CHANGE, payload: { prop, value } };
};

export const verifyExistsCommerce = navigation => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  db.doc(`Commerces/${currentUser.uid}`)
    .get()
    .then(valor => {
      console.log(valor.exists);
      if (valor.exists) {
        navigation.navigate('commerce');
      } else {
        navigation.navigate('commerceRegister');
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const onCreateProfile = (
  { name, avatar, description, cuit, location, email, phone },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  return dispatch => {
    db.runTransaction(() => {
      db.collection(`Commerces`)
        .add({ name, avatar, description, cuit, location, email, phone })
        .then(reference => {
          db.doc(`Profiles/${currentUser.uid}`)
            .set({ commerceId: reference.id })
            .then(() => {
              dispatch({ type: COMMERCE_PROFILE_CREATE });
              navigation.navigate('commerce');
            })
            .catch(error => console.log('4', error));
        })
        .catch(error => console.log('5', error));
    }).catch(error => console.log('6', error));
  };
};
/* export const commerceProfileRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COMMERCE_READING });

    db.collection(`Commerces/${currentUser.uid}`)
      //db.collection(`Commerces/465ExfH0AHaIGXrDpZcnYBCTdLy1/Services`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          dispatch({
            action: COMMERCE_READ,
            payload: doc
          });
        }
      })
      .catch(error => {
        dispatch({
          action: COMMERCE_FAIL,
          payload: error
        });
      });
  };
}; */
