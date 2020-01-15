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
  ON_ROLE_ASSIGNED,
  ON_CLIENT_DATA_VALUE_CHANGE
} from './types';
import getEnvVars from '../../environment';
import { userReauthenticate } from './AuthActions';
import { ROLES } from '../constants';

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

export const onCommerceOpen = commerceId => dispatch => {
  const db = firebase.firestore();
  const profileId = firebase.auth().currentUser.uid;

  // Agregar validaciones por fecha de aceptación (post-Notificaciones)
  db.collection(`Commerces/${commerceId}/Employees`)
    .where('softDelete', '==', null)
    .where('profileId', '==', profileId)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];

        dispatch({
          type: ON_ROLE_ASSIGNED,
          payload: { role: ROLES[doc.data().role.roleId], employeeId: doc.id }
        });
      }

      dispatch({ type: ON_LOCATION_VALUES_RESET });
    })
    .catch(e => console.error(e));
};

export const onCreateCommerce = (commerceData, navigation) => dispatch => {
  dispatch({ type: ON_REGISTER_COMMERCE });

  const {
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
  } = commerceData;

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
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
      softDelete: null,
      creationDate: new Date()
    })
    .then(reference => {
      docId = reference.id;
      const profileRef = db.doc(`Profiles/${currentUser.uid}`);
      const employeesRef = db.collection(`Commerces/${docId}/Employees`);

      profileRef
        .get()
        .then(profile => {
          const { firstName, lastName, email, phone } = profile.data();

          employeesRef.add({
            profileId: profile.id,
            email,
            firstName,
            lastName,
            phone,
            softDelete: null,
            role: { name: 'Dueño', roleId: 'OWNER' },
            inviteDate: new Date(),
            startDate: new Date()
          })
        });

      profileRef
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

export const onCommerceRead = commerceId => async dispatch => {
  dispatch({ type: ON_COMMERCE_READING });

  const db = firebase.firestore();

  try {
    const doc = await db.doc(`Commerces/${commerceId}`).get();

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

    return true;
  } catch (error) {
    dispatch({ type: ON_COMMERCE_READ_FAIL });
    return false;
  }
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
      .then(function (querySnapshot) {
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
                  type: ON_CLIENT_DATA_VALUE_CHANGE,
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
