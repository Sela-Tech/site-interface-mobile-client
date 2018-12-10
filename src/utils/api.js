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
  accessKey: 'AKIAIRTNAQCMVZ5BFDGA',
  secretKey: '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',
  successActionStatus: 201,
};

const uploadToAWS = file => {
  return RNS3.put(file, options)
    .then(response => {
      if (response.status !== 201) {
        console.log('failed');
        return false
      }
      else {
        return response.body;
      }
    })
    .catch(err => {
      return false;
    });
};

export const upload = async data => {
  console.log('data gotten', data);

  // try {
  //   const resp = await axios.post('', data);
  //   return resp;
  // } catch (error) {
  //   return error;
  // }
  const file = {
    uri: data.uri,
    name: data.evidence_name,
    type: 'image/png',
  };
  this.postData = data;
  uploadToAWS(file, data)
    .then(async (awsReply) => {
      if (awsReply === false) {
        return false;
      }
      const data = this.postData;
      // console.log('lets see data', data);
      console.log('awsReply', awsReply);

      data.evidence_name = awsReply.location;
      console.log('lets see data', data)

      return axios.post('', data)
        .then(resp => {
          return resp;
        })
        .catch(err => {
          return err;
        })
      // try {
      //   const resp = await axios.post('', data);
      //   return resp;
      // } catch (error) {
      //   return error;
      // }
    })

};
