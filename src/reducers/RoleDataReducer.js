import { ON_ROLES_READ } from '../actions/types';

const INITIAL_STATE = {
  roles: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_ROLES_READ:
      return { roles: action.payload };
    default:
      return state;
  }
};
