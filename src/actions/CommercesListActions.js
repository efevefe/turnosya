import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READING,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ON_COMMERCE_SEARCHING,
  ON_PROVINCE_FILTER_UPDATE,
  ON_UPDATE_ALL_FILTERS,
  ON_HITS_UPDATE
} from './types';

export const commerceSearching = isSearching => ({
  type: ON_COMMERCE_SEARCHING,
  payload: isSearching
});

export const commerceHitsUpdate = hits => {
  const normalizedHits = [];
  hits.forEach(hit => {
    if (hit._geoloc) {
      normalizedHits.push({ ...hit, latitude: hit._geoloc.lat, longitude: hit._geoloc.lng })
    }
  })
  return { type: ON_HITS_UPDATE, payload: normalizedHits };
};

export const areasRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_AREAS_READING });
    db.collection('Areas')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot => {
        const areas = [];
        snapshot.forEach(doc => areas.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: ON_AREAS_SEARCH_READ, payload: areas });
      });
  };
};

export const deleteFavoriteCommerce = commerceId => {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .delete()
      .then(() =>
        dispatch({ type: FAVORITE_COMMERCE_DELETED, payload: commerceId })
      )
      .catch(err => console.log(err));
  };
};

export const registerFavoriteCommerce = commerceId => {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();
  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}/FavoriteCommerces/${commerceId}`)
      .set({})
      .then(() =>
        dispatch({ type: FAVORITE_COMMERCE_ADDED, payload: commerceId })
      )
      .catch(err => console.log(err));
  };
};

export const readFavoriteCommerces = () => {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return dispatch => {
    db.collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
      .get()
      .then(snapshot => {
        const favorites = [];
        snapshot.forEach(doc => favorites.push(doc.id));
        dispatch({ type: FAVORITE_COMMERCES_READ, payload: favorites });
      });
  };
};

export const readOnlyFavoriteCommerces = () => dispatch => {
  dispatch({ type: ONLY_FAVORITE_COMMERCES_READING });

  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return db
    .collection(`Profiles/${currentUser.uid}/FavoriteCommerces`)
    .onSnapshot(snapshot => {
      const favoriteCommerces = [];
      const onlyFavoriteCommerces = [];
      let processedItems = 0;

      if (snapshot.empty) {
        return dispatch({
          type: ONLY_FAVORITE_COMMERCES_READ,
          payload: { favoriteCommerces, onlyFavoriteCommerces }
        });
      }

      snapshot.forEach(doc => {
        db.doc(`Commerces/${doc.id}`)
          .get()
          .then(commerce => {
            if (commerce.data().softDelete == null) {
              const { profilePicture, name, area, address } = commerce.data();

              onlyFavoriteCommerces.push({
                profilePicture,
                name,
                address,
                areaName: area.name,
                objectID: commerce.id
              });

              favoriteCommerces.push(doc.id);
            }

            processedItems++;

            if (processedItems === snapshot.size) {
              dispatch({
                type: ONLY_FAVORITE_COMMERCES_READ,
                payload: { favoriteCommerces, onlyFavoriteCommerces }
              });
            }
          });
      });
    });
};

export const updateProvinceFilter = provinceName => ({
  type: ON_PROVINCE_FILTER_UPDATE,
  payload: provinceName
});

export const updateAllFilters = filters => ({
  type: ON_UPDATE_ALL_FILTERS,
  payload: filters
});
