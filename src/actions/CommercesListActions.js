import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ON_REFINEMENT_UPDATE,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ONLY_FAVORITE_COMMERCES_READING
} from './types';

export const refinementUpdate = refinement => {
  return { type: ON_REFINEMENT_UPDATE, payload: refinement };
};

export const areasRead = () => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_AREAS_READING });
    db.collection('Areas')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .onSnapshot(snapShot => {
        var areas = [];
        snapShot.forEach(doc => areas.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_AREAS_SEARCH_READ, payload: areas });
      });
  };
};

export const deleteFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .delete()
      .then(() => dispatch({ type: FAVORITE_COMMERCE_DELETED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const registerFavoriteCommerce = commerceId => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .set({})
      .then(() => dispatch({ type: FAVORITE_COMMERCE_ADDED, payload: commerceId }))
      .catch(err => console.log(err));
  };
};

export const readFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
      .get()
      .then(snapshot => {
        var favorites = [];
        snapshot.forEach(doc => favorites.push(doc.id));
        dispatch({ type: FAVORITE_COMMERCES_READ, payload: favorites });
      }
      );
  };
};

export const readOnlyFavoriteCommerces = () => {
  var db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    dispatch({ type: ONLY_FAVORITE_COMMERCES_READING });

    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
      .get()
      .then(snapshot => {
        var favoriteCommerces = [];
        var onlyFavoriteCommerces = [];

        snapshot.forEach(doc => {
          favoriteCommerces.push(doc.id);

          db.doc(`Commerces/${doc.id}`)
            .get()
            .then(commerce => {
              const { profilePicture, name, area, address } = commerce.data();
              onlyFavoriteCommerces.push({ profilePicture, name, address, areaName: area.name, objectID: commerce.id });
            });
        });

        dispatch({
          type: ONLY_FAVORITE_COMMERCES_READ,
          payload: { favoriteCommerces, onlyFavoriteCommerces }
        });
      });
  };
};
