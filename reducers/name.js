import * as types from '../actions/actionTypes';

const nameReducer = (
  state = {
    name: '',
    loading: true,
    error: null,
  },
  action,
) => {
  switch (action.type) {
    case types.GET_NAME:
      return { ...state, name: action.name };
    case types.ADD_NAME:
      return { ...state, name: action.name };
    case types.NAME_IS_LOADING:
      return { ...state, loading: action.isLoading };
    case types.HANDLE_NAME_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default nameReducer;
