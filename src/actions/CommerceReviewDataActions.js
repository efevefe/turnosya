import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_COMMERCE_REVIEW_VALUE_CHANGE } from './types';

export const commerceReviewValueChange = (prop, value) => {
  return { type: ON_COMMERCE_REVIEW_VALUE_CHANGE, payload: { prop, value } };
};
