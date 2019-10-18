import {
  ON_CLIENT_RESERVATIONS_READ,
  ON_CLIENT_RESERVATIONS_READING,
  ON_CLIENT_RESERVATION_CANCELING,
  ON_CLIENT_RESERVATION_CANCEL,
  ON_CLIENT_RESERVATION_CANCEL_FAIL
} from "../actions/types";
import { Toast } from "../components/common";

const INITIAL_STATE = {
  reservations: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_CLIENT_RESERVATIONS_READ:
      return {...state, loading: false, reservations: action.payload };
    case ON_CLIENT_RESERVATIONS_READING:
      return { ...state, loading: true };
    case ON_CLIENT_RESERVATION_CANCELING:
      return { ...state, loading: true };
    case ON_CLIENT_RESERVATION_CANCEL_FAIL:
      Toast.show({ text: "Error al intentar cancelar el turno" });
      return { ...state, loading: false };
    case ON_CLIENT_RESERVATION_CANCEL:
      Toast.show({ text: "Turno Cancelado" });
      return { ...state, loading: false };
    default:
      return state;
  }
};
