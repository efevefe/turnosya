import {
  ON_COMMERCES_LIST_READING,
  ON_COMMERCES_LIST_READ,
  ON_COMMERCES_LIST_SEARCHING,
  ON_COMMERCES_LIST_SEARCHED,
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCE_ADDED,
  READ_FAVORITE_COMMERCE,
  ORDER_FAVORITE_COMMERCE
} from '../actions/types';

const INITIAL_STATE = {
  favoritesCommerce: [],
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
      var favoritesUpdate = state.favoritesCommerce.filter(element => {
        if (element !== action.payload) {
          return element;
        }
      });
      return { ...state, favoritesCommerce: favoritesUpdate };
    case FAVORITE_COMMERCE_ADDED:
      var favorites = state.favoritesCommerce.concat(action.payload);
      return { ...state, favoritesCommerce: favorites };
    case READ_FAVORITE_COMMERCE:
      return { ...state, favoritesCommerce: action.payload };
    default:
      return state;
  }
};
