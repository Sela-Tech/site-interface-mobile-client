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
  console.log('count', data.length);
  return AsyncStorage.setItem('images', JSON.stringify(data))
    .then(() => {
      dispatch(imageIsLoading(false));
      return dispatch(addImage(data));
    })
    .catch(err => {
      dispatch(imageIsLoading(false));
      return dispatch(imageLoadingError(err.message || 'ERROR'));
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


filterImages = (small, big) => {
  // console.log('b', big);
  console.log('big', big);

  console.log('ssjkjdjdjkjkd')
  return big.filter(d => d.uri !== small.uri);
}



export const uploadSingleImage = (data, images) => dispatch => {

  return upload(data)
    .then(resp => {
      if (resp === false) {
        addImage(images);
        return dispatch(imageRollback(data));
      }
      else {
        let a = this.filterImages(data, images);
        console.log(a.length)
        // console.log('the val', a);

        return dispatch(addNewImage(a));
        // console.log('ddjjdjdd', resp.data)
        // let respData = {
        //   resp: resp.data,
        //   data,
        //   images,
        // };

        // console.log('resp dd', respData);
        // return respData;
      }
    })
    .catch(err => {
      console.log('faield', err.message)
      dispatch(imageLoadingError(err.message || 'ERROR'));
      return false;
    });
};



