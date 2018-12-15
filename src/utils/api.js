import Axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { BASE_URL } from './constants';

const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
  },
  onUploadProgress: progressEvent => Math.round((progressEvent.loaded * 100) / progressEvent.total),
});

// Add a request interceptor
axios.interceptors.request.use(
  config => config,
  error => {
    // Do something with request error
    // Do something with response error
    console.log('API ERR:', error.message);
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    // Do something with response error
    console.log('API ERR:', error.message);
    return Promise.reject(error);
  },
);

const options = {
  keyPrefix: 'uploads/',
  bucket: 'iracks-dump',
  region: 'us-east-1',
  successActionStatus: 201,
};

export const uploadToAWS = (file, data, cred) => {
  options.accessKey = cred.key;
  options.secretKey = cred.secret;

  return RNS3.put(file, options)
    .then(response => {
      if (response.status !== 201) {
        return false;
      }
      return response.body;
    })
    .catch(err => console.log('..', err))
  // .catch(err => false);
};

export const upload = async (data, cred) => {
  const file = {
    uri: data.uri,
    name: data.evidence_name,
    type: 'image/png',
  };


  this.postData = data;
  if (data.images) {
    try {
      const resp = await axios.post('/', data);
      return resp;
    } catch (err) {
      return false;
    }
  }
  return uploadToAWS(file, data, cred)
    .then(awsReply => {
      if (awsReply === false) {
        return false;
      }
      data = this.postData;
      data.evidence_name = awsReply.postResponse.location;

      return axios
        .post('/', data)
        .then(resp => resp)
        .catch(err => false);
    })
    .catch(err => false);
  // .catch(err => console.log('..', err))
};

export const getPassCredentials = async () => {
  try {
    const resp = await axios.get('/credentials');
    return resp;
  } catch (err) {
    return err;
  }
};
