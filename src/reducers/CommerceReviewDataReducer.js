import {
  ON_COMMERCE_REVIEW_VALUE_CHANGE,
  ON_COMMERCE_REVIEW_SAVING,
  ON_COMMERCE_REVIEW_SAVED,
  ON_COMMERCE_REVIEW_SAVE_FAIL,
  ON_COMMERCE_REVIEW_CLEAR,
  ON_COMMERCE_REVIEW_CREATED,
  ON_COMMERCE_REVIEW_DELETING,
  ON_COMMERCE_REVIEW_DELETED,
  ON_COMMERCE_REVIEW_DELETE_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  rating: 4,
  comment: "",
  date: "",
  clientId: "",
  commerceId: "",
  reviewId: "",
  saveLoading: false,
  deleteLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_COMMERCE_REVIEW_VALUE_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case ON_COMMERCE_REVIEW_SAVING:
      return { ...state, saveLoading: true };
    case ON_COMMERCE_REVIEW_SAVED:
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_SAVE_FAIL:
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_CREATED:
      return { ...state, reviewId: action.payload };
    case ON_COMMERCE_REVIEW_DELETING:
      return { ...state, deleteLoading: true };
    case ON_COMMERCE_REVIEW_DELETED:
      return INITIAL_STATE;
    case ON_COMMERCE_REVIEW_DELETE_FAIL:
      return { ...state, deleteLoading: false };
    case ON_COMMERCE_REVIEW_CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
};
