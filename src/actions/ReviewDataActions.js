import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_REVIEW_VALUE_CHANGE } from './types';

export const reviewValueChange = (prop, value) => {
  return { type: ON_REVIEW_VALUE_CHANGE, payload: { prop, value } };
};
