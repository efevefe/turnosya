import { combineReducers } from 'redux';
import ServiceFormReducer from './ServiceFormReducer';

export default combineReducers({
    serviceForm: ServiceFormReducer
});