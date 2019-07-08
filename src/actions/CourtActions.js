import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COURT_VALUE_CHANGE,
  COURT_CREATE,
  COURT_FORM_SUBMIT
} from './types';

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

export const courtCreate = ({ name, court, ground, price }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_FORM_SUBMIT });

    db.collection(`Commerces/${currentUser.uid}/Courts`)

      .add({ name, court, ground, price, softDelete: null })
      .then(() => {
        dispatch({ type: COURT_CREATE });
      })
      .catch(error => console.log(error));
  };
};
