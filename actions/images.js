import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import { upload } from '../src/utils/api';

export const allImages = images => ({
  type: types.GET_IMAGE,
  images,
});

export const addImage = image => ({
  type: types.ADD_IMAGE,
  image,
});

export const imageIsLoading = bool => ({
  type: types.IMAGE_IS_LOADING,
  isLoading: bool,
});

export const imageLoadingError = error => ({
  type: types.HANDLE_IMAGE_ERROR,
  error,
});

export const addNewImage = data => dispatch =>
  AsyncStorage.setItem('images', data)
    .then(() => {
      dispatch(imageIsLoading(false));
      dispatch(addImage(data));
    })
    .catch(err => {
      dispatch(imageIsLoading(false));
      dispatch(imageLoadingError(err.message || 'ERROR'));
    });

export const getAllImages = () => dispatch =>
  AsyncStorage.getItem('images')
    .then(resp => {
      dispatch(imageIsLoading(false));
      const image = JSON.parse(resp);
      dispatch(allImages(image));
    })
    .catch(err => {
      dispatch(imageIsLoading(false));
      dispatch(imageLoadingError(err.message || 'ERROR'));
    });

export const uploadSingleImage = data => dispatch => {
  upload(data)
    .then(resp => {
      dispatch(imageIsLoading(false));
      dispatch(addImage(data));
      return resp;
    })
    .catch(err => {
      dispatch(imageLoadingError(err.message || 'ERROR'));
      return err.message;
    });
}
