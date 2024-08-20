import axios from "axios";

const client = axios.create({
  // baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    if (config?.data instanceof FormData) {
      // set headers for FormData
      config.headers = {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      };
    } else {
      // set headers for JSON data
      config.headers = {
        ...config?.headers,
        "Content-Type": "application/json",
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject(error.request);
    } else {
      return Promise.reject(error);
    }
  }
);

const setAuthorization = (token) => {
  client.defaults.headers.common.authorization = token;
};

const clearAuthorization = () => {
  delete client.defaults.headers.common.authorization;
};

export const HttpClient = { ...client, setAuthorization, clearAuthorization };
