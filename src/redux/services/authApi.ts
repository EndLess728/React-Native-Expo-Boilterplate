// src/services/authApi.js
import { baseApi } from './baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),

    register: build.mutation({
      query: (userInfo) => ({
        url: 'auth/register',
        method: 'POST',
        data: userInfo,
      }),
    }),

    logout: build.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
