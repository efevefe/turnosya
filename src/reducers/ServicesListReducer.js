import { ON_SERVICES_READING, ON_SERVICES_READ } from '../actions/types';

const INITIAL_STATE = { services: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_SERVICES_READING:
      return { ...state, loading: true };

    case ON_SERVICES_READ:
      return { services: action.payload, loading: false };

    default:
      return state;
  }
};
