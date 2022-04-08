import axios from 'axios';

export default () => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL:
        'https://92yiuy5790.execute-api.us-east-1.amazonaws.com/production/',
    
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
