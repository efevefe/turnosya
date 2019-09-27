import {
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READING,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ON_COMMERCE_SEARCHING
} from '../actions/types';

const INITIAL_STATE = {
  onlyFavoriteCommerces: [],
  favoriteCommerces: [],
  loading: false,
  searching: true,
  areas: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_AREAS_READING:
      return { ...state, loading: true };
    case FAVORITE_COMMERCE_DELETED:
      var favoritesUpdate = state.favoriteCommerces.filter(element => {
        if (element !== action.payload) {
          return element;
        }
      });
      return { ...state, favoriteCommerces: favoritesUpdate };
    case FAVORITE_COMMERCE_ADDED:
      var favorites = state.favoriteCommerces.concat(action.payload);
      return { ...state, favoriteCommerces: favorites };
    case ONLY_FAVORITE_COMMERCES_READING:
      return {...state , loading: true };
    case FAVORITE_COMMERCES_READ:
      return { ...state, favoriteCommerces: action.payload };
    case ONLY_FAVORITE_COMMERCES_READ:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case ON_AREAS_SEARCH_READ:
      return { ...state, areas: action.payload, loading: false };
    case ON_COMMERCE_SEARCHING:
      return { ...state, searching: action.payload };
    default:
      return state;
  }
};
