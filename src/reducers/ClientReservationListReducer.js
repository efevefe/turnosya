import {
  CLIENT_RERSERVATIONS_READ,
  CLIENT_RERSERVATIONS_READING,
  CLIENT_RERSERVATIONS_FAIL,
  ON_CLIENT_RESERVATION_CANCEL
} from "../actions/types";
import { Toast } from "../components/common";

const INITIAL_STATE = {
  reservations: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLIENT_RERSERVATIONS_READ:
      return { loading: false, reservations: action.payload };
    case CLIENT_RERSERVATIONS_READING:
      return { ...state, loading: true };
    case CLIENT_RERSERVATIONS_FAIL:
      Toast.show({text : action.payload});
      return { INITIAL_STATE, loading: false };
    case ON_CLIENT_RESERVATION_CANCEL:
        Toast.show({text:'Turno Cancelado'})
      return { ...state};
    default:
      return state;
  }
};
