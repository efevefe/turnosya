import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_PROVINCES_READ } from './types';

export const onProvincesIdRead = () => onProvincesRead('id');

export const onProvincesNameRead = () => onProvincesRead('name');

const onProvincesRead = prop => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Provinces')
      .orderBy('name', 'asc')
      .get()
      .then(snapshot => {
        const provincesList = [];
        snapshot.forEach(doc =>
          prop === 'id' // Si agregaramos más atributos (ej: idPaís) sólo habría que agregar una wrapper action y exportarla
            ? provincesList.push({ value: doc.id, label: doc.data().name })
            : provincesList.push({
                value: doc.data()[prop],
                label: doc.data().name
              })
        );
        dispatch({ type: ON_PROVINCES_READ, payload: provincesList });
      });
  };
};
