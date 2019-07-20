import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_REGISTER_COMMERCE,
  COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_VALUE_CHANGE,
  COMMERCE_FAIL,
  ON_COMMERCE_READING,
  ON_COMMERCE_READ_FAIL,
  ON_COMMERCE_READ,
  ON_COMMERCE_UPDATING,
  ON_COMMERCE_UPDATED,
  ON_COMMERCE_UPDATE_FAIL,
  ON_PROVINCES_READ,
  ON_AREAS_READ,
  ON_COMMERCE_OPEN
} from './types';

export const onCommerceValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_VALUE_CHANGE, payload: { prop, value } };
};

export const onCommerceOpen = navigation => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        if (doc.data().commerceId == null) {
          navigation.navigate('commerceRegister');
        } else {
          dispatch({ type: ON_COMMERCE_OPEN, payload: doc.data().commerceId })

          navigation.navigate('commerce');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export const onCreateCommerce = (
  { name, description, cuit, email, phone, address, city, area, province },
  navigation
) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_REGISTER_COMMERCE });

    db.runTransaction(() => {
      db.collection(`Commerces`)
        .add({
          name,
          description,
          cuit,
          email,
          phone,
          address,
          city,
          area,
          province
        })
        .then(reference => {
          db.doc(`Profiles/${currentUser.uid}`)
            .set({ commerceId: reference.id })
            .then(() => {
              dispatch({ type: COMMERCE_PROFILE_CREATE });
              navigation.navigate('commerce');
            })
            .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
        })
        .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
    }).catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
  };
};

export const onCommerceRead = (loadingType) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_READING, payload: loadingType });

    //POR AHORA ACA SE CONSULTA PRIMERO EL ID DEL NEGOCIO DESDE EL CLIENTE, PERO INGRESANDO PRIMERO COMO CLIENTE ESTO NO HARIA
    //FALTA YA QUE EL ID DEL NEGOCIO SE OBTENDRIA DEL REDUCER QUE TIENE LOS DATOS DEL CLIENTE, POR AHORA LO DEJO ASI PARA PROBAR
    db.doc(`Profiles/${currentUser.uid}`).get()
      .then(doc => {
        db.doc(`Commerces/${doc.data().commerceId}`).get()
          .then(doc => {
            //provincia
            var { name, provinceId } = doc.data().province;
            const province = { value: provinceId, label: name };

            //rubro
            var { name, areaId } = doc.data().area;
            const area = { value: areaId, label: name }

            dispatch({
              type: ON_COMMERCE_READ,
              payload: {
                ...doc.data(),
                provincesList: [province],
                areasList: [area],
                commerceId: doc.id
              }
            });
          })
          .catch(error => {
            dispatch({ type: ON_COMMERCE_READ_FAIL });
            console.log(error);
          });
      })
      .catch(error => {
        dispatch({ type: ON_COMMERCE_READ_FAIL });
        console.log(error);
      });
  }
}

export const onCommerceUpdateNoPicture = ({ name, cuit, email, phone, description, address, city, province, area, profilePicture, commerceId }) => {
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_UPDATING });

    db.doc(`Commerces/${commerceId}`)
      .update({ name, cuit, email, phone, description, address, city, province, area, profilePicture })
      .then(dispatch({ type: ON_COMMERCE_UPDATED, payload: profilePicture }))
      .catch(error => {
        dispatch({ type: ON_COMMERCE_UPDATE_FAIL });
        console.log(error);
      })
  }
}

export const onCommerceUpdateWithPicture = ({ name, cuit, email, phone, description, address, city, province, area, profilePicture, commerceId }) => {
  var ref = firebase.storage().ref(`Commerces/${commerceId}`).child(`${commerceId}-ProfilePicture`);
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_UPDATING });

    ref.put(profilePicture)
      .then(snapshot => {
        profilePicture.close();
        snapshot.ref.getDownloadURL()
          .then(url => {
            db.doc(`Commerces/${commerceId}`)
              .update({ name, cuit, email, phone, description, address, city, province, area, profilePicture: url })
              .then(dispatch({ type: ON_COMMERCE_UPDATED, payload: url }))
              .catch(error => {
                dispatch({ type: ON_COMMERCE_UPDATE_FAIL })
                console.log(error);
              });
          })
          .catch(error => {
            dispatch({ type: ON_COMMERCE_UPDATE_FAIL })
            console.log(error);
          });
      })
      .catch((error) => {
        profilePicture.close();
        dispatch({ type: ON_COMMERCE_UPDATE_FAIL })
        console.log(error);
      });
  }
}

export const onProvincesRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Provinces').
      orderBy('name', 'asc').
      get()
      .then(snapshot => {
        var provincesList = [];
        snapshot.forEach(doc => provincesList.push({ value: doc.id, label: doc.data().name }));
        dispatch({ type: ON_PROVINCES_READ, payload: provincesList })
      })
  }
}

export const onAreasRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Areas').
      orderBy('name', 'asc').
      get()
      .then(snapshot => {
        var areasList = [];
        snapshot.forEach(doc => areasList.push({ value: doc.id, label: doc.data().name }));
        dispatch({ type: ON_AREAS_READ, payload: areasList })
      })
  }
}
