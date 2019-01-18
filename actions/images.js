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

export const imageRollback = image => ({
  type: types.IMAGE_ROLLBACK,
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

export const addNewImage = data => dispatch => {
  dispatch(addImage(data));
  data = JSON.stringify(data);
  return AsyncStorage.setItem('images', data)
    .then(() => {
      dispatch(imageIsLoading(false));
    })
    .catch(err => {
      dispatch(imageIsLoading(false));
      return dispatch(imageLoadingError(err.message || 'ERROR'));
    });
};

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

filterImages = (small, big) => {
  // bug here
  // big.filter(c => c.uri !== small.uri); expected operation
  big.shift();
  return big;
};

export const uploadSingleImage = (data, images, credentials) => dispatch =>
  upload(data, credentials)
    .then(resp => {
      if (resp !== false) {
        images = this.filterImages(data, images);
        dispatch(addNewImage(images));
        return resp.data;
      }
      addImage(images);
      return dispatch(imageRollback(data));
    })
    .catch(err => {
      dispatch(imageLoadingError(err.message || 'ERROR'));
      return false;
    });
