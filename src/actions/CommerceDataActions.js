import firebase from 'firebase/app';
import 'firebase/firestore';
import algoliasearch from 'algoliasearch';
import {
  ON_REGISTER_COMMERCE,
  ON_COMMERCE_PROFILE_CREATE,
  ON_COMMERCE_VALUE_CHANGE,
  ON_COMMERCE_CREATE_FAIL,
  ON_COMMERCE_READING,
  ON_COMMERCE_READ_FAIL,
  ON_COMMERCE_READ,
  ON_COMMERCE_UPDATING,
  ON_COMMERCE_UPDATED,
  ON_COMMERCE_UPDATE_FAIL,
  ON_AREAS_READ_FOR_PICKER,
  ON_COMMERCE_OPEN,
  ON_COMMERCE_CREATING,
  ON_LOCATION_VALUES_RESET,
  ON_CUIT_NOT_EXISTS,
  ON_CUIT_EXISTS,
  ON_COMMERCE_DELETING,
  ON_COMMERCE_DELETED,
  ON_COMMERCE_DELETE_FAIL,
  ON_REAUTH_FAIL,
  ON_REAUTH_SUCCESS,
  ON_ROLE_ASSIGNED,
  ON_CLIENT_DATA_VALUE_CHANGE
} from './types';
import getEnvVars from '../../environment';
import { userReauthenticate } from './AuthActions';
import { ROLES } from '../constants';

const { appId, adminApiKey, commercesIndex } = getEnvVars().algoliaConfig;

const client = algoliasearch(appId, adminApiKey);
const index = client.initIndex(commercesIndex);

export const onCommerceValueChange = payload => {
  return { type: ON_COMMERCE_VALUE_CHANGE, payload };
};

export const onCommerceFormOpen = () => {
  return dispatch => {
    dispatch({ type: ON_COMMERCE_CREATING });
    dispatch({ type: ON_LOCATION_VALUES_RESET });
  };
};

export const onMyCommerceOpen = (commerceId, navigation) => dispatch => {
  dispatch({ type: ON_COMMERCE_OPEN, payload: commerceId });
  dispatch({ type: ON_ROLE_ASSIGNED, payload: ROLES.OWNER });
  dispatch({ type: ON_LOCATION_VALUES_RESET });

  navigation.navigate('commerce');
};

export const onCommerceOpen = (commerceId, navigation) => dispatch => {
  const db = firebase.firestore();
  const profileId = firebase.auth().currentUser.uid;

  // Agregar validaciones por fecha de aceptación (post-Notificaciones)
  db.collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null)
    .where('profileId', '==', profileId)
    .get()
    .then(snapshot => {
      dispatch({ type: ON_COMMERCE_OPEN, payload: commerceId });
      dispatch({
        type: ON_ROLE_ASSIGNED,
        payload: ROLES[snapshot.docs[0].data().role.roleId]
      });
      dispatch({ type: ON_LOCATION_VALUES_RESET });

      navigation.navigate('commerce');
    })
    .catch(e => console.error(e));
};

export const onCommerceCreate = (
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
                dispatch({ type: ON_COMMERCE_PROFILE_CREATE });
                dispatch({ type: ON_ROLE_ASSIGNED, payload: ROLES.OWNER });

                navigation.navigate('commerce');
              })
              .catch(error =>
                dispatch({ type: ON_COMMERCE_CREATE_FAIL, payload: error })
              );
          })
          .catch(error =>
            dispatch({ type: ON_COMMERCE_CREATE_FAIL, payload: error })
          );
      })
      .catch(error =>
        dispatch({ type: ON_COMMERCE_CREATE_FAIL, payload: error })
      );
  };
};

export const onCommerceRead = commerceId => {
  const db = firebase.firestore();

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

export const onAreasReadForPicker = () => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection('Areas')
      .where('softDelete', '==', null)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot => {
        const areasList = [];
        snapshot.forEach(doc =>
          areasList.push({ value: doc.id, label: doc.data().name })
        );
        dispatch({ type: ON_AREAS_READ_FOR_PICKER, payload: areasList });
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
        !querySnapshot.empty
          ? dispatch({ type: ON_CUIT_EXISTS })
          : dispatch({ type: ON_CUIT_NOT_EXISTS });
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
                  type: ON_CLIENT_DATA_VALUE_CHANGE,
                  payload: { commerceId: null }
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
