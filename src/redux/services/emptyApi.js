import { createApi } from "@reduxjs/toolkit/query";
import { HttpClient } from "./HttpClient";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await HttpClient({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const emptyApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "https://example.com",
  }),
  endpoints: () => {},
});
