import { createApi } from "@reduxjs/toolkit/query/react";
import { HttpClient } from "./HttpClient";
import { Alert } from "react-native";
import { logout } from "../slices/userSlicer";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, params, headers, body }, api) => {
    try {
      const result = await HttpClient.request({
        url: baseUrl + url,
        method,
        data: body,
        // body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      const status = err.response?.status;

      if (status === 401) {
        Alert.alert(
          "Session Expired",
          "Your session has timed out. Please log in again to continue."
        );
        api?.dispatch(logout());
        api?.dispatch(baseApi.util.resetApiState());
      }

      return {
        error: {
          status,
          ...(err.response?.data || err.message),
        },
      };
    }
  };

export const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "https://example.com",
  }),
  endpoints: () => ({}),
});
