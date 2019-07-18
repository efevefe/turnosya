import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_REGISTER_COMMERCE,
  COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_VALUE_CHANGE,
  COMMERCE_FAIL
} from './types';

export const onCommerceValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_VALUE_CHANGE, payload: { prop, value } };
};

export const verifyExistsCommerce = navigation => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  db.doc(`Profiles/${currentUser.uid}`)
    .get()
    .then(doc => {
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
export const onCreateCommerce = (
  { name, description, cuit, email, phone, address, city, area, province },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();
  return dispatch => {
    dispatch({ type: ON_REGISTER_COMMERCE });
    db.runTransaction(() => {
      db.collection(`Commerces`)
        .add({
          name,
          description,
          cuit,
          email,
          phone,
          address,
          city,
          area,
          province
        })
        .then(reference => {
          db.doc(`Profiles/${currentUser.uid}`)
            .set({ commerceId: reference.id })
            .then(() => {
              dispatch({ type: COMMERCE_PROFILE_CREATE });
              navigation.navigate('commerce');
            })
            .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
        })
        .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
    }).catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
  };
};
