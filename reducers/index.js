import { combineReducers } from 'redux';
import images from './images';
import name from './name';
import credentials from './credentials';

export default combineReducers({
  images,
  name,
  credentials,
});
