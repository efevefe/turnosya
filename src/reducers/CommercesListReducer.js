import {
  FAVORITE_COMMERCE_DELETED,
  FAVORITE_COMMERCE_ADDED,
  FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READ,
  ONLY_FAVORITE_COMMERCES_READING,
  ON_AREAS_READING,
  ON_AREAS_SEARCH_READ,
  ON_COMMERCE_SEARCHING,
  ON_PROVINCE_FILTER_UPDATE,
  ON_UPDATE_ALL_FILTERS,
  ON_HITS_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
  onlyFavoriteCommerces: [],
  favoriteCommerces: [],
  loading: false,
  searching: true,
  areas: [],
  provinceNameFilter: '',
  locationEnabled: false,
  locationButtonIndex: 0,
  locationRadiusKms: 10,
  markers: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_AREAS_READING:
      return { ...state, loading: true };
    case FAVORITE_COMMERCE_DELETED:
      const favoritesUpdate = state.favoriteCommerces.filter(element => {
        if (element !== action.payload) {
          return element;
        }
      });
      return { ...state, favoriteCommerces: favoritesUpdate };
    case FAVORITE_COMMERCE_ADDED:
      const favorites = state.favoriteCommerces.concat(action.payload);
      return { ...state, favoriteCommerces: favorites };
    case ONLY_FAVORITE_COMMERCES_READING:
      return { ...state, loading: true };
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
    case ON_PROVINCE_FILTER_UPDATE:
      return { ...state, provinceNameFilter: action.payload };
    case ON_UPDATE_ALL_FILTERS:
      return { ...state, ...action.payload };
    case ON_HITS_UPDATE:
      return { ...state, markers: action.payload };
    default:
      return state;
  }
};
