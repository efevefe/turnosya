import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_COURT_VALUE_CHANGE } from './types';

export const onCourtValueChange = ({ prop, value }) => {
  return { type: ON_COURT_VALUE_CHANGE, payload: { prop, value } };
};

export const getCourtAndGroundTypes = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection('CourtType')
      .get()
      .then(querySnapshot => {
        let courts = [];
        let grounds = [];
        let i = 1;
        querySnapshot.forEach(doc => {
          courts.push({ value: i, label: doc.id });
          grounds.push({ value: i, label: doc.data().groundType });
          i++;
        });

        dispatch({
          type: ON_COURT_VALUE_CHANGE,
          payload: { prop: 'courts', value: courts }
        });
        dispatch({
          type: ON_COURT_VALUE_CHANGE,
          payload: { prop: 'grounds', value: grounds }
        });
      })
      .catch(err => console.log(err));
  };
};
