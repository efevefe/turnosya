import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_COURT_VALUE_CHANGE, ON_COURT_CREATE } from './types';

export const onCourtValueChange = ({ prop, value }) => {
  return { type: ON_COURT_VALUE_CHANGE, payload: { prop, value } };
};
