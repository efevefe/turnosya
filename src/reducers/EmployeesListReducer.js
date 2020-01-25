import { ON_EMPLOYEES_READ, ON_EMPLOYEES_READING, ON_EMPLOYEES_READ_FAIL } from '../actions/types';

const INITIAL_STATE = { employees: [], loading: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_EMPLOYEES_READING:
      return { ...state, loading: true };

    case ON_EMPLOYEES_READ:
      return { ...state, employees: action.payload, loading: false };

    case ON_EMPLOYEES_READ_FAIL:
      return { ...state, loading: false };

    default:
      return state;
  }
};
