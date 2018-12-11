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
  return AsyncStorage.setItem('images', JSON.stringify(data))
    .then(() => {
      dispatch(imageIsLoading(false));
      dispatch(addImage(data));
    })
    .catch(err => {
      dispatch(imageIsLoading(false));
      dispatch(imageLoadingError(err.message || 'ERROR'));
    });
}


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



export const uploadSingleImage = (data, allImages) => dispatch => {
  return upload(data)
    .then(resp => {
      if (resp === false) {
        addImage(allImages);
        return dispatch(imageRollback(data));
      }
      else {
        dispatch(imageIsLoading(false));
        dispatch(addImage(data));
        return resp;
      }
    })
    .catch(err => {
      dispatch(imageLoadingError(err.message || 'ERROR'));
      return false;
    });
};
