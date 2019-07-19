import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_COURT_VALUE_CHANGE,
  ON_COURT_FORM_OPEN,
  COURT_CREATE,
  COURT_FORM_SUBMIT,
  COURT_EXISTED,
  COURT_READING,
  COURT_READ,
  COURT_DELETE,
  COURT_UPDATE
} from './types';

export const onCourtValueChange = ({ prop, value }) => {
  return { type: ON_COURT_VALUE_CHANGE, payload: { prop, value } };
};

export const onCourtFormOpen = () => {
  return { type: ON_COURT_FORM_OPEN };
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
        let i = 0;
        querySnapshot.forEach(doc => {
          courts.push({ value: doc.id, label: doc.id, key: i });

          const ground = [];
          doc.data().groundType.forEach((value, j) => {
            ground.push({ value, label: value, key: j });
          });

          grounds.push(ground);

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

        //dispatch({ type: COURT_FORM_SUBMIT });
      })
      .catch(err => console.log(err));
  };
};

export const courtCreate = (
  { name, court, ground, price, lightPrice, checked, courtState },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_FORM_SUBMIT });
    db.collection(`Commerces/${currentUser.uid}/Courts`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          //Means that court's name already exists
          dispatch({ type: COURT_EXISTED });
        } else {
          db.collection(`Commerces/${currentUser.uid}/Courts`)
            .add({
              name,
              court,
              ground,
              price,
              lightPrice,
              checked,
              courtState,
              softDelete: null
            })
            .then(() => {
              dispatch({ type: COURT_CREATE });
              navigation.goBack();
            })
            .catch(error => console.log(error));
        }
      });
  };
};

export const courtsRead = () => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_READING });
    db.collection(`Commerces/${currentUser.uid}/Courts`)
      .where('softDelete', '==', null)
      .orderBy('courtState', 'desc')

      .orderBy('name', 'asc')
      .onSnapshot(snapshot => {
        var courts = [];
        snapshot.forEach(doc => courts.push({ ...doc.data(), id: doc.id }));
        dispatch({ type: COURT_READ, payload: courts });
      });
  };
};

export const courtDelete = ({ id }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    db.doc(`Commerces/${currentUser.uid}/Courts/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: COURT_DELETE }))
      .catch(err => console.log(err));
  };
};

export const courtUpdate = (
  { id, name, court, ground, price, lightPrice, checked, courtState },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_FORM_SUBMIT });

    db.collection(`Commerces/${currentUser.uid}/Courts`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty && querySnapshot.docs[0].id !== id) {
          dispatch({ type: COURT_EXISTED });
        } else {
          db.doc(`Commerces/${currentUser.uid}/Courts/${id}`)
            .update({
              name,
              court,
              ground,
              price,
              lightPrice,
              checked,
              courtState
            })
            .then(() => {
              dispatch({ type: COURT_UPDATE });
              navigation.goBack();
            })
            .catch(error => console.log(error));
        }
      });
  };
};
