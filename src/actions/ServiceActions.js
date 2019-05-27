import firebase from "firebase/app";
import "firebase/firestore";
import { ON_VALUE_CHANGE, CREATE_SERVICE } from "./types";

export const onValueChange = ({ prop, value }) => {
  return { type: ON_VALUE_CHANGE, payload: { prop, value } };
};

export const createService = ({ name, duration, price, description }) => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    db.collection(`Negocios/${currentUser.uid}/Servicios`)
      .add({ name, duration, price, description })
      .then(() => dispatch({ type: CREATE_SERVICE }))
      .catch(error => console.log(error));
  };
};
