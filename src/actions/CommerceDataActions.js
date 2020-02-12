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
  ON_COMMERCE_MP_TOKEN_READ,
  ON_COMMERCE_MP_TOKEN_READING,
  ON_COMMERCE_MP_TOKEN_READ_FAIL,
  ON_COMMERCE_MP_TOKEN_SWITCHING,
  ON_COMMERCE_MP_TOKEN_SWITCHED,
  ON_COMMERCE_MP_TOKEN_SWITCH_FAIL,
  ON_COMMERCE_UPDATING,
  ON_COMMERCE_UPDATED,
  ON_COMMERCE_UPDATE_FAIL,
  ON_AREAS_READ_FOR_PICKER,
  ON_COMMERCE_CREATING,
  ON_LOCATION_VALUE_CHANGE,
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
    dispatch({
      type: ON_LOCATION_VALUE_CHANGE,
      payload: { address: '', city: '', provinceName: '', country: '', latitude: null, longitude: null }
    });
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
    .catch(error => console.error(error));
};

export const onCommerceCreate = (commerceData, navigation) => async dispatch => {
  dispatch({ type: ON_REGISTER_COMMERCE });

  const { name, cuit, email, phone, description, area, address, city, province, latitude, longitude } = commerceData;

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  const batch = db.batch();

  try {
    const commerceRef = db.collection(`Commerces`).doc();

    batch.set(commerceRef, {
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
    });

    const commerceId = commerceRef.id;
    const profileRef = db.doc(`Profiles/${currentUser.uid}`);
    const employeesRef = db.collection(`Commerces/${commerceId}/Employees`).doc();

    batch.update(profileRef, { commerceId });

    const profile = await profileRef.get();

    batch.set(employeesRef, {
      profileId: profile.id,
      email: profile.data().email,
      firstName: profile.data().firstName,
      lastName: profile.data().lastName,
      phone: profile.data().phone,
      softDelete: null,
      role: { name: ROLES.OWNER.name, roleId: ROLES.OWNER.roleId },
      inviteDate: new Date(),
      startDate: new Date()
    });

    await batch.commit();

    await index.addObject({
      objectID: commerceId,
      name,
      description,
      areaName: area.name,
      address,
      city,
      provinceName: province.name,
      ...(latitude && longitude ? { _geoloc: { lat: latitude, lng: longitude } } : {})
    });

    dispatch({
      type: ON_ROLE_ASSIGNED,
      payload: { role: ROLES.OWNER, employeeId: employeesRef.id }
    });

    dispatch({ type: ON_COMMERCE_VALUE_CHANGE, payload: { commerceId } });

    dispatch({ type: ON_COMMERCE_PROFILE_CREATE });

    navigation.navigate(`${area.areaId}`);
    navigation.navigate(`${area.areaId}Calendar`);
  } catch (error) {
    dispatch({ type: ON_COMMERCE_CREATE_FAIL, payload: error });
  }
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

export const onCommerceUpdate = (commerceData, navigation) => async dispatch => {
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
      profilePictureURL = await onPictureUpdate(commerceId, profilePicture, 'ProfilePicture');

    if (headerPicture instanceof Blob)
      headerPictureURL = await onPictureUpdate(commerceId, headerPicture, 'HeaderPicture');

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
      ...(latitude && longitude ? { _geoloc: { lat: latitude, lng: longitude } } : {})
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
        snapshot.forEach(doc => areasList.push({ value: doc.id, label: doc.data().name }));
        dispatch({ type: ON_AREAS_READ_FOR_PICKER, payload: areasList });
      });
  };
};

export const onCuitValidate = cuit => {
  const db = firebase.firestore();

  return dispatch => {
    db.collection(`Commerces/`)
      .where('cuit', '==', cuit)
      .where('softDelete', '==', null)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          dispatch({ type: ON_CUIT_EXISTS });
        } else {
          dispatch({ type: ON_CUIT_NOT_EXISTS });
        }
      });
  };
};

export const onCommerceDelete = (password, navigation = null) => dispatch => {
  dispatch({ type: ON_COMMERCE_DELETING });

  const { currentUser } = firebase.auth();
  const db = firebase.firestore();
  const batch = db.batch();

  userReauthenticate(password)
    .then(async () => {
      dispatch({ type: ON_REAUTH_SUCCESS });

      try {
        const userRef = db.doc(`Profiles/${currentUser.uid}`);
        const user = await userRef.get();

        const commerceId = user.data().commerceId;
        const commerceRef = db.doc(`Commerces/${commerceId}`);

        batch.update(userRef, { commerceId: null });
        batch.update(commerceRef, { softDelete: new Date() });

        const employees = await db
          .collection(`Commerces/${commerceId}/Employees`)
          .where('softDelete', '==', null)
          .get();

        for await (const employee of employees.docs) {
          const workplaces = await db
            .collection(`Profiles/${employee.data().profileId}/Workplaces`)
            .where('softDelete', '==', null)
            .where('commerceId', '==', commerceId)
            .get();

          workplaces.forEach(workplace => {
            batch.update(workplace.ref, { softDelete: new Date() });
          });
        }

        await batch.commit();

        await index.deleteObject(commerceId);

        dispatch({ type: ON_COMMERCE_DELETED });

        dispatch({
          type: ON_CLIENT_DATA_VALUE_CHANGE,
          payload: { commerceId: null }
        });

        navigation && navigation.navigate('client');
      } catch (error) {
        dispatch({ type: ON_COMMERCE_DELETE_FAIL });
      }
    })
    .catch(error => {
      dispatch({ type: ON_REAUTH_FAIL });
      dispatch({ type: ON_COMMERCE_DELETE_FAIL });
    });
};

export const onCommerceMPagoTokenRead = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_MP_TOKEN_READING });

  const db = firebase.firestore();

  db.collection(`Commerces/${commerceId}/MercadoPagoTokens`)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const currentToken = snapshot.docs.find(doc => doc.data().softDelete === null);
        currentToken
          ? dispatch({
              type: ON_COMMERCE_MP_TOKEN_READ,
              payload: { mPagoToken: currentToken.id, hasAnyMPagoToken: true }
            })
          : dispatch({ type: ON_COMMERCE_MP_TOKEN_READ, payload: { mPagoToken: null, hasAnyMPagoToken: true } });
      } else {
        dispatch({ type: ON_COMMERCE_MP_TOKEN_READ, payload: { mPagoToken: null, hasAnyMPagoToken: false } });
      }
    })
    .catch(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_READ_FAIL }));
};

export const onCommerceMPagoTokenEnable = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCHING });

  const db = firebase.firestore();

  db.collection(`Commerces/${commerceId}/MercadoPagoTokens`)
    .orderBy('softDelete', 'desc')
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const latestToken = snapshot.docs[0].id;
        db.doc(`Commerces/${commerceId}/MercadoPagoTokens/${latestToken}`)
          .update({ softDelete: null })
          .then(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCHED, payload: latestToken }))
          .catch(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCH_FAIL }));
      }
    })
    .catch(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCH_FAIL }));
};

export const onCommerceMPagoTokenDisable = commerceId => dispatch => {
  dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCHING });

  const db = firebase.firestore();

  db.collection(`Commerces/${commerceId}/MercadoPagoTokens`)
    .where('softDelete', '==', null)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const latestToken = snapshot.docs[0].id;
        db.doc(`Commerces/${commerceId}/MercadoPagoTokens/${latestToken}`)
          .update({ softDelete: new Date() })
          .then(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCHED, payload: null }))
          .catch(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCH_FAIL }));
      }
    })
    .catch(() => dispatch({ type: ON_COMMERCE_MP_TOKEN_SWITCH_FAIL }));
};
