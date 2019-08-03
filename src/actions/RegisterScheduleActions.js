import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_SCHEDULE_FORM_OPEN,
  ON_SCHEDULE_VALUE_CHANGE,
  SCHEDULE_FORM_SUBMIT
} from './types';

export const onScheduleValueChange = ({ prop, value }) => {
  return { type: ON_SCHEDULE_VALUE_CHANGE, payload: { prop, value } };
};

export const onScheduleFormOpen = () => {
  return { type: ON_SCHEDULE_FORM_OPEN };
};
