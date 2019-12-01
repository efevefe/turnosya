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
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  rating: 4,
  comment: '',
  reviewId: '',
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
      Toast.show({ text: 'Calificación guardada con éxito.' });
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_SAVE_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, saveLoading: false };
    case ON_COMMERCE_REVIEW_CREATED:
      Toast.show({ text: 'Calificación guardada con éxito.' });
      return { ...state, reviewId: action.payload, saveLoading: false };
    case ON_COMMERCE_REVIEW_DELETING:
      return { ...state, deleteLoading: true };
    case ON_COMMERCE_REVIEW_DELETED:
      Toast.show({ text: 'Calificación borrada con éxito.' });
      return INITIAL_STATE;
    case ON_COMMERCE_REVIEW_DELETE_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, deleteLoading: false };
    case ON_COMMERCE_REVIEW_CLEAR:
      return INITIAL_STATE;
    default:
      return state;
  }
};
