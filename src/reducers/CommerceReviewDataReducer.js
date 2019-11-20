import {
  ON_COMMERCE_REVIEW_VALUE_CHANGE,
  ON_COMMERCE_REVIEW_CREATING,
  ON_COMMERCE_REVIEW_CREATED,
  ON_COMMERCE_REVIEW_CREATE_FAIL,
  ON_COMMERCE_REVIEW_CLEAR
} from "../actions/types";

const INITIAL_STATE = {
  rating: 4,
  comment: "",
  date: "",
  clientId: "",
  commerceId: "",
  saveLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_REVIEW_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_REVIEW_CREATING:
      return { ...state, saveLoading: true };
    case ON_COMMERCE_REVIEW_CREATED:
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_CREATE_FAIL:
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
};
