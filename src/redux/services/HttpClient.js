import { showErrorToast } from "@/components/ToastAlert";
import axios from "axios";

const client = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = "PUT YOUR AUTH TOKEN HERE";
    const baseHeaders = {
      ...config.headers,
    };

    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }

    config.headers = {
      ...baseHeaders,
      "Content-Type":
        config.data instanceof FormData
          ? "multipart/form-data"
          : "application/json",
    };
    // __DEV__ && console.log("Starting Request:", JSON.stringify(config, null, 2));
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    // __DEV__ && console.log("\n\n-----API  RESPOSNE----\n" + JSON.stringify(response) + "\n\n");

    return response;
  },
  (error) => {
    __DEV__ &&
      console.log(
        "\n\n-----API ERROR RESPOSNE----\n" +
          JSON.stringify(error.response.data) +
          "\n\n"
      );

    if (error.response.data) {
      var errorMessage = "";
      if (error.response.data.error) {
        errorMessage = error.response.data.error.join(", ");
      } else {
        errorMessage = error.response.data.message;
      }

      showErrorToast({ title: errorMessage ?? "Something went wrong" });
    }

    return Promise.reject(error);
  }
);

const setAuthorization = (token) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthorization = () => {
  delete client.defaults.headers.common.Authorization;
};

export { client, setAuthorization, clearAuthorization };
