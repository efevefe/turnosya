import {
  ON_CLIENT_REVIEW_VALUE_CHANGE,
  ON_CLIENT_REVIEW_SAVING,
  ON_CLIENT_REVIEW_SAVED,
  ON_CLIENT_REVIEW_SAVE_FAIL,
  ON_CLIENT_REVIEW_VALUES_RESET,
  ON_CLIENT_REVIEW_CREATED,
  ON_CLIENT_REVIEW_DELETING,
  ON_CLIENT_REVIEW_DELETED,
  ON_CLIENT_REVIEW_DELETE_FAIL,
  ON_CLIENT_REVIEW_READING,
  ON_CLIENT_REVIEW_READ,
  ON_CLIENT_REVIEW_READ_FAIL
} from '../actions/types';
import { Toast } from '../components/common';

const INITIAL_STATE = {
  rating: 0,
  comment: '',
  reviewId: '',
  saveLoading: false,
  deleteLoading: false,
  dataLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ON_CLIENT_REVIEW_VALUE_CHANGE:
      return { ...state, ...action.payload };

    case ON_CLIENT_REVIEW_SAVING:
      return { ...state, saveLoading: true };

    case ON_CLIENT_REVIEW_SAVED:
      Toast.show({ text: 'Calificación guardada con éxito.' });
      return { ...state, saveLoading: false };

    case ON_CLIENT_REVIEW_SAVE_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, saveLoading: false };

    case ON_CLIENT_REVIEW_CREATED:
      Toast.show({ text: 'Calificación guardada con éxito.' });
      return { ...state, reviewId: action.payload, saveLoading: false };

    case ON_CLIENT_REVIEW_DELETED:
      Toast.show({ text: 'Calificación borrada con éxito.' });
    case ON_CLIENT_REVIEW_VALUES_RESET:
      return { ...INITIAL_STATE };

    case ON_CLIENT_REVIEW_READING:
      return { ...state, dataLoading: true };

    case ON_CLIENT_REVIEW_READ_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
    case ON_CLIENT_REVIEW_READ:
      return { ...state, dataLoading: false, ...action.payload };

    case ON_CLIENT_REVIEW_DELETING:
      return { ...state, deleteLoading: true };

    case ON_CLIENT_REVIEW_DELETED:
      Toast.show({ text: 'Calificación borrada con éxito.' });
      return { ...INITIAL_STATE };

    case ON_CLIENT_REVIEW_DELETE_FAIL:
      Toast.show({ text: 'Se ha producido un error, inténtelo de nuevo.' });
      return { ...state, deleteLoading: false };

    default:
      return state;
  }
};
