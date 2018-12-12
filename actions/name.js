import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';

export const getOwnerName = name => ({
  type: types.GET_NAME,
  name,
});

export const addName = name => ({
  type: types.ADD_NAME,
  name,
});

export const nameIsLoading = bool => ({
  type: types.NAME_IS_LOADING,
  isLoading: bool,
});

export const nameLoadingError = error => ({
  type: types.HANDLE_NAME_ERROR,
  error,
});

export const addNewName = data => dispatch =>
  AsyncStorage.setItem('name', data)
    .then(() => {
      dispatch(nameIsLoading(false));
      data = JSON.parse(data);
      dispatch(addName(data));
    })
    .catch(err => {
      dispatch(nameIsLoading(false));
      dispatch(nameLoadingError(err.message || 'ERROR'));
    });

export const getName = () => dispatch =>
  AsyncStorage.getItem('name')
    .then(resp => {
      dispatch(nameIsLoading(false));
      const name = JSON.parse(resp);
      dispatch(getOwnerName(name));
    })
    .catch(err => {
      dispatch(nameIsLoading(false));
      dispatch(nameLoadingError(err.message || 'ERROR'));
    });
