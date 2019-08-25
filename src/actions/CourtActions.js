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
  COURT_UPDATE,
  COMMERCE_COURT_TYPES_READ,
  COMMERCE_COURT_TYPES_READING,
  COMMERCE_COURT_TYPES_READ_FAIL
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
      })
      .catch(err => console.log(err));
  };
};

export const courtCreate = (
  { name, court, ground, price, lightPrice, courtState, commerceId },
  navigation
) => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_FORM_SUBMIT });
    db.collection(`Commerces/${commerceId}/Courts`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          //Means that court's name already exists
          dispatch({ type: COURT_EXISTED });
        } else {
          db.collection(`Commerces/${commerceId}/Courts`)
            .add({
              name,
              court,
              ground,
              price,
              lightPrice,
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

export const courtsRead = commerceId => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_READING });
    db.collection(`Commerces/${commerceId}/Courts`)
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

export const courtDelete = ({ id, commerceId }) => {
  var db = firebase.firestore();

  return dispatch => {
    db.doc(`Commerces/${commerceId}/Courts/${id}`)
      .update({ softDelete: new Date() })
      .then(() => dispatch({ type: COURT_DELETE }))
      .catch(err => console.log(err));
  };
};

export const courtUpdate = (
  { id, name, court, ground, price, lightPrice, courtState, commerceId },
  navigation
) => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COURT_FORM_SUBMIT });

    db.collection(`Commerces/${commerceId}/Courts`)
      .where('name', '==', name)
      .where('softDelete', '==', null)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty && querySnapshot.docs[0].id !== id) {
          dispatch({ type: COURT_EXISTED });
        } else {
          db.doc(`Commerces/${commerceId}/Courts/${id}`)
            .update({
              name,
              court,
              ground,
              price,
              lightPrice,
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

export const onCommerceCourtTypesRead = ({ commerceId, loadingType }) => {
  /* 
    ESTA ACTION ES PARA CONSULTAR LOS TIPOS DE CANCHA CUANDO EL CLIENTE QUIERE VER LOS TURNOS, LA PONGO
    ACA PORQUE ESTA RELACIONADO CON ESTO Y TAMBIEN SE PODRIA USAR PARA QUE EL NEGOCIO LISTE SUS TIPOS DE
    CANCHA, DE ULTIMA LA CAMBIAMOS DE LUGAR
  */

  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: COMMERCE_COURT_TYPES_READING, payload: loadingType });

    db.collection(`Commerces/${commerceId}/Courts`)
      .where('softDelete', '==', null)
      .get()
      .then(snapshot => {
        var courtTypesList = [];

        snapshot.forEach(doc => {
          if (!courtTypesList.includes(doc.data().court)) {
            courtTypesList.push(doc.data().court);
          }
        });

        dispatch({ type: COMMERCE_COURT_TYPES_READ, payload: courtTypesList });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: COMMERCE_COURT_TYPES_READ_FAIL })
      });
  }

}
