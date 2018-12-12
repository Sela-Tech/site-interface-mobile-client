import Axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { BASE_URL } from './constants';

const axios = Axios.create({
  baseURL: BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axios.interceptors.request.use(
  config =>
    // Do something before request is sent
    // config,
    config,
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

const uploadToAWS = (file, data, cred) => {
  options.accessKey = cred.key;
  options.secretKey = cred.secret;
  return RNS3.put(file, options)
    .then(response => {
      if (response.status !== 201) {
        return false;
      }
      return response.body;
    })
    .catch(err => false);
};

export const upload = (data, cred) => {
  const file = {
    uri: data.uri,
    name: data.evidence_name,
    type: 'image/png',
  };
  this.postData = data;

  return uploadToAWS(file, data, cred)
    .then(awsReply => {
      if (awsReply === false) {
        return false;
      }
      const data = this.postData;
      data.evidence_name = awsReply.postResponse.location;
      return axios
        .post('/', data)
        .then(resp => resp)
        .catch(err => false);
    })
    .catch(err => {
      console.log('failed', err.message);
    });
};

export const getPassCredentials = async data => {
  try {
    const resp = await axios.post('/credentials', data);
    return resp;
  } catch (err) {
    return err;
  }
};
