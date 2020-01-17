import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_ROLES_READ } from './types';

export const readRoles = () => dispatch => {
  const db = firebase.firestore();
  let roles = [];

  db.collection('Roles')
    .where('softDelete', '==', null)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().name !== 'Dueño')
          roles.push({
            key: doc.id,
            label: doc.data().name,
            value: { roleId: doc.id, name: doc.data().name }
          });
      });
      dispatch({ type: ON_ROLES_READ, payload: roles });
    });
};
