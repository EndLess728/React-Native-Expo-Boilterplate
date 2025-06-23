import { createApi } from "@reduxjs/toolkit/query/react";
import { client } from "./HttpClient";
import { BASE_URL } from "@/constants/ApiUrls";
import { logout } from "../slices/userSlicer";
import NetInfo from "@react-native-community/netinfo";
import i18n from "@/localization/i18n";
import { showErrorToast } from "@/components";
import { Alert } from "react-native";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }, api) => {
    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        showErrorToast({ title: i18n.t("noInternetError") });

        // Don't make the actual HTTP call
        return {
          error: {
            status: "NETWORK_ERROR",
            data: {
              message: "No internet connection",
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
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        Alert.alert(i18n.t("sessionExpired"), i18n.t("sessionExpiredMessage"), [
          {
            text: "OK",
            onPress: () => {
              api.dispatch(logout());
              api.dispatch(baseApi.util.resetApiState());
            },
          },
        ]);
      }

      return {
        error: {
          status: status || "UNKNOWN_ERROR",
          data: error.response?.data || error.message || "Something went wrong",
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "base_api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: () => ({}),
  tagTypes: [
    "GET_USER_PROFILE_DETAILS",
    "GET_SCHEDULED_RIDE_LIST",
    "ACTIVE_RIDE",
  ],
});
