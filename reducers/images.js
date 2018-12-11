import * as types from '../actions/actionTypes';

const imageReducer = (
  state = {
    images: [],
    new_image: {},
    loading: true,
    error: null,
  },
  action,
) => {
  switch (action.type) {
    case types.GET_IMAGE:
      return { ...state, images: action.images };
    case types.ADD_IMAGE:
      return { ...state, images: action.image };
    case types.IMAGE_IS_LOADING:
      return { ...state, loading: action.isLoading };
    case types.HANDLE_IMAGE_ERROR:
      return { ...state, error: action.error };
    case types.IMAGE_ROLLBACK:
      return { ...state, images: state.images.concat(image) };
    default:
      return state;
  }
};

export default imageReducer;
