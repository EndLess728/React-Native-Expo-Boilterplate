import NetInfo from '@react-native-community/netinfo';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Alert } from 'react-native';

import { showErrorToast } from '@/components';
import { BASE_URL } from '@/constants/ApiUrls';
import i18n from '@/localization/i18n';

import { logout } from '../actions/authAction';
import { client } from './HttpClient';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async (
    {
      url,
      method,
      data,
      params,
      headers,
    }: { url: string; method: string; data?: any; params?: any; headers?: any },
    api: any,
  ) => {
    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        showErrorToast({ title: i18n.t('noInternetError') });

        // Don't make the actual HTTP call
        return {
          error: {
            status: 'NETWORK_ERROR',
            data: {
              message: 'No internet connection',
            },
          },
        };
      }

      // Only proceed if connected
      const result = await client({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        Alert.alert(i18n.t('sessionExpired'), i18n.t('sessionExpiredMessage'), [
          {
            text: 'OK',
            onPress: () => {
              api.dispatch(logout());
              api.dispatch(baseApi.util.resetApiState());
            },
          },
        ]);
      }

      return {
        error: {
          status: status || 'UNKNOWN_ERROR',
          data: error.response?.data || error.message || 'Something went wrong',
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'base_api',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL as string,
  }),
  endpoints: () => ({}),
  tagTypes: ['GET_USER_PROFILE_DETAILS', 'GET_SCHEDULED_RIDE_LIST', 'ACTIVE_RIDE'],
});
