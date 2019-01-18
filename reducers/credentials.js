import * as types from '../actions/actionTypes';

const credentialsReducer = (
  state = {
    credentials: {},
    loading: true,
    error: null,
  },
  action,
) => {
  switch (action.type) {
    case types.GET_CREDENTIALS:
      return { ...state, credentials: action.credentials };
    case types.ADD_CREDENTIALS:
      return { ...state, credentials: action.credentials };
    case types.CREDENTIALS_IS_LOADING:
      return { ...state, loading: action.isLoading };
    case types.HANDLE_CREDENTIALS_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default credentialsReducer;
