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
  bucket: 'iracks-dump-test',
  region: 'us-east-1',
  accessKey: 'AKIAIRTNAQCMVZ5BFDGA',
  secretKey: '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',
  successActionStatus: 201,
};

const uploadToAWS = file => {
  console.log('file', file);
  console.log('options', options);
  RNS3.put(file, options)
    .then(response => {
      console.log(response);
      // if (response.status !== 201)
      //   // throw new Error("Failed to upload image to S3");
      //   console.log(response.body);
      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
    })
    .catch(err => err.message);
};

export const upload = async data => {
  const file = {
    uri: data.uri,
    name: data.evidence_name,
    type: 'image/png',
  };
  // upload to aws
  const awsReply = await uploadToAWS(file);
  console.log('awsReply', awsReply);

  data.evidence_name = awsReply.location;

  try {
    const resp = await axios.post('/', data);
    return resp;
  } catch (error) {
    return error;
  }
};
