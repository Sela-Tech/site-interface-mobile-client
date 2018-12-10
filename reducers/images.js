
import * as types from '../actions/actionTypes';

const imageReducer = (state = {
  images: {},
  loading: true,
  error: null,
}, (action - { images, isLoading, error })) => {
  switch (action.type) {
    case types.GET_IMAGE:
      return { ...state, images: action.images };
    case types.ADD_IMAGE:
      const data = { data: action.images };
      return { ...state, images: data };
    case types.IMAGE_IS_LOADING:
      return { ...state, loading: action.isLoading };
    case types.HANDLE_IMAGE_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default imageReducer;
