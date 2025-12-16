import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { showErrorToast } from '@/components/ToastAlert';

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = 'PUT YOUR AUTH TOKEN HERE';

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    const contentType =
      config.data instanceof FormData ? 'multipart/form-data' : 'application/json';
    config.headers.set('Content-Type', contentType);

    // __DEV__ && console.log("Starting Request:", JSON.stringify(config, null, 2));
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

interface ErrorResponse {
  error?: string[];
  message?: string;
}

client.interceptors.response.use(
  (response: AxiosResponse) => {
    // __DEV__ && console.log("\n\n-----API  RESPOSNE----\n" + JSON.stringify(response) + "\n\n");

    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    __DEV__ &&
      console.log(
        '\n\n-----API ERROR RESPOSNE----\n' + JSON.stringify(error.response?.data) + '\n\n',
      );

    if (error.response?.data) {
      let errorMessage = '';
      if (error.response.data.error) {
        errorMessage = error.response.data.error.join(', ');
      } else {
        errorMessage = error.response.data.message || 'Something went wrong';
      }

      showErrorToast({ title: errorMessage });
    }

    return Promise.reject(error);
  },
);

const setAuthorization = (token: string) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthorization = () => {
  delete client.defaults.headers.common.Authorization;
};

export { clearAuthorization, client, setAuthorization };
