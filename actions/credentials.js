import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import { getPassCredentials } from '../src/utils/api';

export const getOwnerCredentials = credentials => ({
  type: types.GET_CREDENTIALS,
  credentials,
});

export const addCredentials = credentials => ({
  type: types.ADD_CREDENTIALS,
  credentials,
});

export const credentialsIsLoading = bool => ({
  type: types.CREDENTIALS_IS_LOADING,
  isLoading: bool,
});

export const credentialsLoadingError = error => ({
  type: types.HANDLE_CREDENTIALS_ERROR,
  error,
});

export const saveCredentials = data => dispatch => {
  dispatch(addCredentials(data));
  AsyncStorage.setItem('credentials', JSON.stringify(data))
    .then(() => {
      dispatch(credentialsIsLoading(false));
    })
    .catch(err => {
      dispatch(credentialsIsLoading(false));
      dispatch(credentialsLoadingError(err.message || 'ERROR'));
    });
};

export const getAccessCredentials = () => dispatch =>
  getPassCredentials()
    .then(resp => {
      if (resp.status === 200) {
        dispatch(credentialsIsLoading(false));
        dispatch(saveCredentials(resp.data));
        return true;
      }
      return resp.status;
    })
    .catch(err => {
      dispatch(credentialsIsLoading(false));
      dispatch(credentialsLoadingError(err.message || 'ERROR'));
      return false;
    });

export const getCredentials = () => dispatch =>
  AsyncStorage.getItem('credentials')
    .then(resp => {
      dispatch(credentialsIsLoading(false));
      const credentials = JSON.parse(resp);
      dispatch(addCredentials(credentials));
    })
    .catch(err => {
      dispatch(credentialsIsLoading(false));
      dispatch(credentialsLoadingError(err.message || 'ERROR'));
      return false;
    });
