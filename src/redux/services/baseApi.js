import { createApi } from "@reduxjs/toolkit/query/react";
import { HttpClient } from "./HttpClient";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, params, headers, body }) => {
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
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
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
