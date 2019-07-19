import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';
import RegisterFormReducer from './RegisterFormReducer';
<<<<<<< HEAD
import CourtFormReducer from './CourtFormReducer';
import CourtListReducer from './CourtListReducer';
=======
import CommerceProfileReducers from './CommerceProfileReducers';
>>>>>>> origin/s3-021-ConsultarDatosNegocio

export default combineReducers({
  auth: AuthReducer,
  registerForm: RegisterFormReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer,
<<<<<<< HEAD
  courtForm: CourtFormReducer,
  courtsList: CourtListReducer
=======
  commerceProfile: CommerceProfileReducers
>>>>>>> origin/s3-021-ConsultarDatosNegocio
});
