import firebase from 'firebase';
import { ON_VALUE_CHANGE, CREATE_SERVICE } from './types';

export const onValueChange = ({ prop, value }) => {
    return { type: ON_VALUE_CHANGE, payload: { prop, value } };
};

export const createService = ({ name, duration, price, description }) => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        firebase.database().ref(`/Negocios/${currentUser.uid}/Servicios`)
            .push({ name, duration, price, description })
            .then(() => {
                dispatch({ type: CREATE_SERVICE });
            })
            .catch(error => console.log(error));

        /*
        db.collection(`Negocios/${currentUser.uid}/Servicios`).add({ name, duration, price, description })
        .then(() => dispatch({ type: CREATE_SERVICE }))
        .catch(error => console.log(error));
        */
    }
}