import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ
} from '../actions/types';

const INITIAL_STATE = {
  onlyFavoriteCommerces: [],
  favoriteCommerces: [],
  commerces: [],
  loading: false,
  searching: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCES_LIST_READING:
      return { ...state, loading: true };
    case ON_COMMERCES_LIST_READ:
      return { ...state, commerces: action.payload, loading: false };
    case ON_COMMERCES_LIST_SEARCHING:
      return { ...state, searching: true };
    case ON_COMMERCES_LIST_SEARCHED:
      return { ...state, commerces: action.payload, searching: false };
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
    case FAVORITE_COMMERCES_READ:
      return { ...state, favoriteCommerces: action.payload };
    case ONLY_FAVORITE_COMMERCES_READ:
      return {
        ...state,
        onlyFavoriteCommerces: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
