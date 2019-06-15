import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';
import RegiterReducer from './RegisterReducer';

export default combineReducers({
  auth: AuthReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer,
  registerForm: RegiterReducer
});
