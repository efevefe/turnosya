import { combineReducers } from 'redux';
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
import CourtReservationReducer from './CourtReservationReducer';
import ClientReservationsListReducer from './ClientReservationsListReducer';
import CourtReservationsListReducer from './CourtReservationsListReducer';
import LocationDataReducer from './LocationDataReducer';
import ProvinceDataReducer from './ProvinceDataReducer';
import CommerceReviewDataReducer from './CommerceReviewDataReducer';
import CommerceReviewsListReducer from './CommerceReviewsListReducer';
import ClientReviewDataReducer from './ClientReviewDataReducer';
import ClientReviewsListReducer from './ClientReviewsListReducer';

export default combineReducers({
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
  courtReservation: CourtReservationReducer,
  clientReservationsList: ClientReservationsListReducer,
  courtReservationsList: CourtReservationsListReducer,
  locationData: LocationDataReducer,
  provinceData: ProvinceDataReducer,
  commerceReviewData: CommerceReviewDataReducer,
  commerceReviewsList: CommerceReviewsListReducer,
  clientReviewData: ClientReviewDataReducer,
  clientReviewsList: ClientReviewsListReducer
});
