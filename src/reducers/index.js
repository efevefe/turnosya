import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';
import RegisterFormReducer from './RegisterFormReducer';
import CommerceDataReducer from './CommerceDataReducer';

export default combineReducers({
  auth: AuthReducer,
  registerForm: RegisterFormReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer,
  commerceData: CommerceDataReducer
});
