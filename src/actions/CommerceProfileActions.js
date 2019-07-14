import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_REGISTER_COMMERCE,
  COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_VALUE_CHANGE,
  COMMERCE_FAIL
} from './types';

export const onComemrceValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_VALUE_CHANGE, payload: { prop, value } };
};

export const verifyExistsCommerce = navigation => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  db.doc(`Profiles/${currentUser.uid}`)
    .get()
    .then(doc => {
      console.log(doc.data(), currentUser.uid, doc.data().commerceId == null)
      if (doc.data().commerceId == null) {
        navigation.navigate('commerceRegister');
      } else {
        navigation.navigate('commerce');
      }
    })
    .catch(error => {
      console.log(error);
    });
};
export const onCreateProfile = (
  { name, avatar, description, cuit, email, phone, address, city, sector, province },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  return dispatch => {
    dispatch({ type: ON_REGISTER_COMMERCE });
    db.runTransaction(() => {
      console.log('1')
      db.collection(`Commerces`)
        .add({ name, avatar, description, cuit, email, phone, address, city, sector, province })
        .then(reference => {
          db.doc(`Profiles/${currentUser.uid}`)
            .set({ commerceId: reference.id })
            .then(() => {
              console.log('2')
              dispatch({ type: COMMERCE_PROFILE_CREATE });
              navigation.navigate('commerce');
            })
            .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
        })
        .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
    }).catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
  };
};
