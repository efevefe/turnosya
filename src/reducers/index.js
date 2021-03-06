import { combineReducers, createStore, applyMiddleware } from 'redux';
import { ON_LOGOUT_FINISHED } from '../actions/types';
import ReduxThunk from 'redux-thunk';
import ServiceFormReducer from './ServiceFormReducer';
import ServicesListReducer from './ServicesListReducer';
import AuthReducer from './AuthReducer';
import ClientDataReducer from './ClientDataReducer';
import CourtFormReducer from './CourtFormReducer';
import CourtListReducer from './CourtListReducer';
import CommerceDataReducer from './CommerceDataReducer';
import CommercesListReducer from './CommercesListReducer';
import CommerceScheduleReducer from './CommerceScheduleReducer';
import CommerceCourtTypesReducer from './CommerceCourtTypesReducer';
import ReservationReducer from './ReservationReducer';
import ClientReservationsListReducer from './ClientReservationsListReducer';
import ReservationsListReducer from './ReservationsListReducer';
import LocationDataReducer from './LocationDataReducer';
import ProvinceDataReducer from './ProvinceDataReducer';
import CommerceReviewDataReducer from './CommerceReviewDataReducer';
import CommerceReviewsListReducer from './CommerceReviewsListReducer';
import ClientReviewDataReducer from './ClientReviewDataReducer';
import ClientReviewsListReducer from './ClientReviewsListReducer';
import EmployeesListReducer from './EmployeesListReducer';
import EmployeeDataReducer from './EmployeeDataReducer';
import RoleDataReducer from './RoleDataReducer';
import CommerceReportsReducer from './CommerceReportsReducer';
import NotificationsListReducer from './NotificationsListReducer';
import PaymentDataReducer from './PaymentDataReducer';
import ManualsReducer from './ManualsReducer';

const reducers = combineReducers({
  auth: AuthReducer,
  clientData: ClientDataReducer,
  serviceForm: ServiceFormReducer,
  servicesList: ServicesListReducer,
  courtForm: CourtFormReducer,
  courtsList: CourtListReducer,
  commerceData: CommerceDataReducer,
  commercesList: CommercesListReducer,
  commerceSchedule: CommerceScheduleReducer,
  commerceCourtTypes: CommerceCourtTypesReducer,
  reservation: ReservationReducer,
  clientReservationsList: ClientReservationsListReducer,
  reservationsList: ReservationsListReducer,
  locationData: LocationDataReducer,
  provinceData: ProvinceDataReducer,
  commerceReviewData: CommerceReviewDataReducer,
  commerceReviewsList: CommerceReviewsListReducer,
  clientReviewData: ClientReviewDataReducer,
  clientReviewsList: ClientReviewsListReducer,
  employeesList: EmployeesListReducer,
  employeeData: EmployeeDataReducer,
  roleData: RoleDataReducer,
  commerceReports: CommerceReportsReducer,
  notificationsList: NotificationsListReducer,
  paymentData: PaymentDataReducer,
  manuals: ManualsReducer
});

const rootReducer = (state, action) => {
  if (action.type === ON_LOGOUT_FINISHED) {
    state = undefined;
  }

  return reducers(state, action);
};
export default createStore(rootReducer, {}, applyMiddleware(ReduxThunk));
