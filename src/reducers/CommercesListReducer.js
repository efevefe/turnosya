import {
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READING,
  ON_REFINEMENT_UPDATE,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ
} from '../actions/types';

const INITIAL_STATE = {
  onlyFavoriteCommerces: [],
  favoriteCommerces: [],
  refinement: '',
  loading: false,
  areas: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_REFINEMENT_UPDATE:
      return { ...state, refinement: action.payload };
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
      return {...state , loading:true}
    case FAVORITE_COMMERCES_READ:
      console.log(action.payload)
      return { ...state, favoriteCommerces: action.payload };
    case ONLY_FAVORITE_COMMERCES_READ:
      return {
        ...state,
        onlyFavoriteCommerces: action.payload,
        loading: false
      };
    case ON_AREAS_SEARCH_READ:
      return { ...state, areas: action.payload, loading: false };
    default:
      return state;
  }
};
