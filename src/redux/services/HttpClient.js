import axios from "axios";

const client = axios.create({
  baseURL: "https:example.com",
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

// client.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Return a standardized error format
//       return Promise.reject({
//         status: error.response.status,
//         data: error.response.data,
//       });
//     } else if (error.request) {
//       // The request was made but no response was received
//       return Promise.reject({
//         status: null,
//         data: error.message,
//       });
//     } else {
//       // Something happened in setting up the request
//       return Promise.reject({
//         status: null,
//         data: error.message,
//       });
//     }
//   }
// );

const setAuthorization = (token) => {
  client.defaults.headers.common.authorization = `Bearer ${token}`;
};

const clearAuthorization = () => {
  delete client.defaults.headers.common.authorization;
};

export const HttpClient = { ...client, setAuthorization, clearAuthorization };
