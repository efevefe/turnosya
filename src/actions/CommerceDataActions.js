import firebase from 'firebase/app';
import 'firebase/firestore';
import algoliasearch from 'algoliasearch';
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
  ON_AREAS_READ,
  ON_COMMERCE_OPEN,
  ON_COMMERCE_CREATING,
  ON_LOCATION_VALUES_RESET,
  CUIT_NOT_EXISTS,
  CUIT_EXISTS,
  ON_COMMERCE_DELETING,
  ON_COMMERCE_DELETED,
  ON_COMMERCE_DELETE_FAIL,
  ON_REAUTH_FAIL,
  ON_REAUTH_SUCCESS,
  ON_REGISTER_VALUE_CHANGE,
  ON_PROVINCES_READ
} from './types';
import getEnvVars from '../../environment';
import { userReauthenticate } from './AuthActions';

const { algoliaConfig } = getEnvVars();
const { appId, adminApiKey, commercesIndex } = algoliaConfig;

const client = algoliasearch(appId, adminApiKey);
const index = client.initIndex(commercesIndex);

export const onCommerceValueChange = ({ prop, value }) => {
  return { type: ON_COMMERCE_VALUE_CHANGE, payload: { prop, value } };
};

export const onCommerceFormOpen = () => {
  return dispatch => {
    dispatch({ type: ON_COMMERCE_CREATING });
    dispatch({ type: ON_LOCATION_VALUES_RESET });
  };
};

export const onCommerceOpen = navigation => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return dispatch => {
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        if (doc.data().commerceId == null) {
          navigation.navigate('commerceRegister');
        } else {
          dispatch({ type: ON_COMMERCE_OPEN, payload: doc.data().commerceId });
          dispatch({ type: ON_LOCATION_VALUES_RESET });

          navigation.navigate('commerce');
        }
      });
  };
};

export const onCreateCommerce = (
  {
    name,
    cuit,
    email,
    phone,
    description,
    area,
    address,
    city,
    province,
    latitude,
    longitude
  },
  navigation
) => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_REGISTER_COMMERCE });

    let docId;

    db.collection(`Commerces`)
      .add({
        name,
        cuit,
        email,
        phone,
        description,
        area,
        address,
        city,
        province,
        latitude,
        longitude,
        softDelete: null
      })
      .then(reference => {
        docId = reference.id;
        db.doc(`Profiles/${currentUser.uid}`)
          .update({ commerceId: docId })
          .then(() => {
            index
              .addObject({
                objectID: docId,
                name,
                description,
                areaName: area.name,
                address,
                city,
                provinceName: province.name,
                ...(latitude && longitude
                  ? { _geoloc: { lat: latitude, lng: longitude } }
                  : {})
              })
              .then(() => {
                dispatch({ type: COMMERCE_PROFILE_CREATE });
                navigation.navigate('commerce');
              })
              .catch(error =>
                dispatch({ type: COMMERCE_FAIL, payload: error })
              );
          })
          .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
      })
      .catch(error => dispatch({ type: COMMERCE_FAIL, payload: error }));
  };
};

export const onCommerceRead = () => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_READING });

    //POR AHORA ACA SE CONSULTA PRIMERO EL ID DEL NEGOCIO DESDE EL CLIENTE, PERO INGRESANDO
    //PRIMERO COMO CLIENTE ESTO NO HARIA
    //FALTA YA QUE EL ID DEL NEGOCIO SE OBTENDRIA DEL REDUCER QUE TIENE LOS DATOS DEL
    //CLIENTE, POR AHORA LO DEJO ASI PARA PROBAR
    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => {
        db.doc(`Commerces/${doc.data().commerceId}`)
          .get()
          .then(doc => {
            //province
            var { name, provinceId } = doc.data().province;
            const province = { value: provinceId, label: name };

            //area
            var { name, areaId } = doc.data().area;
            const area = { value: areaId, label: name };

            dispatch({
              type: ON_COMMERCE_READ,
              payload: {
                ...doc.data(),
                areasList: [area],
                commerceId: doc.id
              }
            });
            dispatch({
              type: ON_PROVINCES_READ,
              payload: [province]
            });
          })
          .catch(error => dispatch({ type: ON_COMMERCE_READ_FAIL }));
      })
      .catch(error => dispatch({ type: ON_COMMERCE_READ_FAIL }));
  };
};

export const onCommerceReadProfile = commerceId => {
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_COMMERCE_READING });

    db.doc(`Commerces/${commerceId}`)
      .get()
      .then(doc => {
        //province
        var { name, provinceId } = doc.data().province;
        const province = { value: provinceId, label: name };

        //area
        var { name, areaId } = doc.data().area;
        const area = { value: areaId, label: name };

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
      });
  };
};

onPictureUpdate = async (commerceId, picture, type) => {
  const ref = firebase
    .storage()
    .ref(`Commerces/${commerceId}`)
    .child(`${commerceId}-${type}`);

  try {
    const snapshot = await ref.put(picture);
    const url = await snapshot.ref.getDownloadURL();
    return url;
  } catch (error) {
    throw new Error(error);
  } finally {
    picture.close();
  }
};

export const onCommerceUpdate = (
  commerceData,
  navigation
) => async dispatch => {
  dispatch({ type: ON_COMMERCE_UPDATING });

  const {
    name,
    cuit,
    email,
    phone,
    description,
    address,
    city,
    province,
    area,
    profilePicture,
    headerPicture,
    commerceId,
    latitude,
    longitude
  } = commerceData;

  let profilePictureURL = null;
  let headerPictureURL = null;

  try {
    if (profilePicture instanceof Blob)
      profilePictureURL = await onPictureUpdate(
        commerceId,
        profilePicture,
        'ProfilePicture'
      );

    if (headerPicture instanceof Blob)
      headerPictureURL = await onPictureUpdate(
        commerceId,
        headerPicture,
        'HeaderPicture'
      );

    await firebase
      .firestore()
      .doc(`Commerces/${commerceId}`)
      .update({
        ...commerceData,
        profilePicture: profilePictureURL ? profilePictureURL : profilePicture,
        headerPicture: headerPictureURL ? headerPictureURL : headerPicture
      });

    await index.saveObject({
      address,
      areaName: area.name,
      profilePicture: profilePictureURL ? profilePictureURL : profilePicture,
      objectID: commerceId,
      description,
      name,
      city,
      provinceName: province.name,
      ...(latitude && longitude
        ? { _geoloc: { lat: latitude, lng: longitude } }
        : {})
    });

    dispatch({
      type: ON_COMMERCE_UPDATED,
      payload: {
        profilePicture: profilePictureURL ? profilePictureURL : profilePicture,
        headerPicture: headerPictureURL ? headerPictureURL : headerPicture
      }
    });

    navigation.goBack();
  } catch (error) {
    dispatch({ type: ON_COMMERCE_UPDATE_FAIL });
  }
};

export const onAreasRead = () => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Areas')
      .orderBy('name', 'asc')
      .get()
      .then(snapshot => {
        const areasList = [];
        snapshot.forEach(doc =>
          areasList.push({ value: doc.id, label: doc.data().name })
        );
        dispatch({ type: ON_AREAS_READ, payload: areasList });
      });
  };
};

export const validateCuit = cuit => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/`)
      .where('cuit', '==', cuit)
      .where('softDelete', '==', null)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          dispatch({ type: CUIT_EXISTS });
        } else {
          dispatch({ type: CUIT_NOT_EXISTS });
        }
      });
  };
};

export const onCommerceDelete = (password, navigation = null) => {
  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  let docId;

  return dispatch => {
    dispatch({ type: ON_COMMERCE_DELETING });

    userReauthenticate(password)
      .then(() => {
        dispatch({ type: ON_REAUTH_SUCCESS });

        const userRef = db.doc(`Profiles/${currentUser.uid}`);

        db.runTransaction(transaction => {
          return transaction.get(userRef).then(userDoc => {
            docId = userDoc.data().commerceId;

            const commerceRef = db.doc(`Commerces/${docId}`);

            transaction.update(userRef, { commerceId: null });
            transaction.update(commerceRef, { softDelete: new Date() });
          });
        })
          .then(() => {
            index
              .deleteObject(docId)
              .then(() => {
                dispatch({ type: ON_COMMERCE_DELETED });
                dispatch({
                  type: ON_REGISTER_VALUE_CHANGE,
                  payload: { prop: 'commerceId', value: null }
                });

                if (navigation) {
                  navigation.navigate('client');
                }
              })
              .catch(error => dispatch({ type: ON_COMMERCE_DELETE_FAIL }));
          })
          .catch(error => dispatch({ type: ON_COMMERCE_DELETE_FAIL }));
      })
      .catch(error => {
        dispatch({ type: ON_REAUTH_FAIL });
        dispatch({ type: ON_COMMERCE_DELETE_FAIL });
      });
  };
};
