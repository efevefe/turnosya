import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';

export default combineReducers({
    serviceForm: ServiceFormReducer,
    servicesList: ServicesListReducer
});