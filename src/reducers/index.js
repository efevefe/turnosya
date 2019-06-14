import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';

export default combineReducers({
  auth: AuthReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer
});
