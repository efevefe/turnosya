import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ
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
export const deleteFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .delete()
      .then(dispatch({ type: FAVORITE_COMMERCE_DELETED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const registerFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .set({})
      .then(dispatch({ type: FAVORITE_COMMERCE_ADDED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const readFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`).onSnapshot(
      snapShot => {
        var favorites = [];
        snapShot.forEach(doc => favorites.push(doc.id));
        dispatch({ type: FAVORITE_COMMERCES_READ, payload: favorites });
      }
    );
  };
};

export const readOnlyFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    dispatch({ type: ON_COMMERCES_LIST_READING });
    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`).onSnapshot(
      snapShot => {
        var favoritesCommerce = [];
        snapShot.forEach(doc => {
          db.doc(`Commerces/${doc.id}`)
            .get()
            .then(commerce => {
              favoritesCommerce.push({ ...commerce.data(), id: commerce.id });
              dispatch({
                type: ONLY_FAVORITE_COMMERCES_READ,
                payload: favoritesCommerce
              });
            });
        });
      }
    );
  };
};
