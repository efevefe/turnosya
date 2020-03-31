import { ON_CLIENT_REVIEWS_READING, ON_CLIENT_REVIEWS_READ, ON_CLIENT_REVIEWS_READ_FAIL } from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = { clientReviews: [], loading: false, refreshing: false, moreData: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_CLIENT_REVIEWS_READING:
      return { ...state, [action.payload]: true };

    case ON_CLIENT_REVIEWS_READ:
      let { reviews, firstRead } = action.payload;
      const clientReviews = firstRead ? reviews : [...state.clientReviews, ...reviews];

      return { ...state, clientReviews, loading: false, refreshing: false, moreData: !!(reviews.length === 12) };

    case ON_CLIENT_REVIEWS_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, loading: false, refreshing: false };

    default:
      return state;
  }
};
