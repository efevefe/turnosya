import {
  ON_EMPLOYEE_VALUE_CHANGE,
  ON_EMPLOYEE_VALUES_RESET,
  ON_EMPLOYEE_NAME_CLEAR,
  ON_USER_SEARCHING,
  ON_USER_SEARCH_SUCCESS,
  ON_USER_SEARCH_FAIL,
  ON_EMPLOYEE_SAVING,
  ON_EMPLOYEE_SAVE_FAIL,
  EMPLOYEE_VALIDATION_ERROR,
  ON_EMPLOYEE_DELETED,
  ON_EMPLOYEE_CREATED,
  ON_EMPLOYEE_UPDATED
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  profileId: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  role: {},
  employeeId: '',
  emailLoading: false,
  emailError: '',
  saveLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_EMPLOYEE_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_EMPLOYEE_NAME_CLEAR:
      return { ...state, firstName: '', lastName: '', phone: '' };

    case ON_USER_SEARCHING:
      return { ...state, emailLoading: true, emailError: '' };

    case ON_USER_SEARCH_SUCCESS:
      return { ...state, ...action.payload, emailLoading: false };

    case ON_USER_SEARCH_FAIL:
      return { ...state, emailLoading: false, emailError: action.payload };

    case ON_EMPLOYEE_SAVING:
      return { ...state, saveLoading: true };

    case ON_EMPLOYEE_SAVE_FAIL:
      Toast.show({
        text: 'Ha ocurrido un error. Por favor inténtelo de nuevo.'
      });
      return { ...state, saveLoading: false };

    case ON_EMPLOYEE_CREATED:
    case ON_EMPLOYEE_UPDATED:
      Toast.show({ text: 'Empleado guardado exitosamente. ' });
      return { ...state, saveLoading: false };

    case EMPLOYEE_VALIDATION_ERROR:
      return { ...state, emailError: action.payload };

    case ON_EMPLOYEE_DELETED:
      Toast.show({ text: 'Empleado eliminado exitosamente.' });
    case ON_EMPLOYEE_VALUES_RESET:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
};
