import { ON_COURT_RESERVATION_VALUE_CHANGE } from "./types";

export const onCourtReservationValueChange = ({ prop, value }) => {
  return { type: ON_COURT_RESERVATION_VALUE_CHANGE, payload: { prop, value } };
}