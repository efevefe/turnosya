import { ON_COMMERCE_REVIEWS_READING, ON_COMMERCE_REVIEWS_READ, ON_COMMERCE_REVIEWS_READ_FAIL } from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = { commerceReviews: [], loading: true, refreshing: false, moreData: true };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_REVIEWS_READING:
      return { ...state, [action.payload]: true };

    case ON_COMMERCE_REVIEWS_READ:
      let { reviews, firstRead } = action.payload;
      const commerceReviews = firstRead ? reviews : [...state.commerceReviews, ...reviews];

      return { ...state, commerceReviews, loading: false, refreshing: false, moreData: !!reviews.length };

    case ON_COMMERCE_REVIEWS_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, loading: false, refreshing: false };

    default:
      return state;
  }
};
