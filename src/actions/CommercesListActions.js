import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCE_DELETED,
  READ_FAVORITE_COMMERCE
} from './types';

export const commercesRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCES_LIST_READING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => commerces.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_COMMERCES_LIST_READ, payload: commerces });
      });
  };
};

export const searchCommerces = search => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCES_LIST_SEARCHING });
    db.collection('Commerces')
      .where('softDelete', '==', null)
      .onSnapshot(snapShot => {
        var commerces = [];
        snapShot.forEach(doc => {
          const name = doc.data().name.toLowerCase();
          if (name.includes(search.toLowerCase())) {
            commerces.push({ ...doc.data(), id: doc.id });
          }
        });

        dispatch({ type: ON_COMMERCES_LIST_SEARCHED, payload: commerces });
      });
  };
};
export const deleteFavoritesCommerces = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoritesCommerces/${commerceId}`)
      .delete()
      .then(dispatch({ type: FAVORITE_COMMERCE_DELETED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const registerFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoritesCommerces/${commerceId}`)
      .set({})
      .then(dispatch({ type: FAVORITE_COMMERCE_ADDED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const readFavoriteCommerce = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    console.log('entro action');
    db.collection(`Profiles/${currentUser.uid}/FavoritesCommerces`).onSnapshot(
      snapShot => {
        var favorites = [];
        snapShot.forEach(doc => favorites.push({ id: doc.id }));
        dispatch({ type: READ_FAVORITE_COMMERCE, payload: favorites });
      }
    );
  };
};
