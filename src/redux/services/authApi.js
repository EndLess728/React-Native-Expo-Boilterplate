// src/services/authApi.js
import { emptyApi } from "./emptyApi";

const authApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: build.mutation({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),

    logout: build.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
