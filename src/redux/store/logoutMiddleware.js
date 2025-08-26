import { storage } from "@/storage";
import { baseApi } from "../services/baseApi";
import { AUTH_LOGOUT, RESET_STATE } from "../types";

export const logoutMiddleware = (store) => (next) => (action) => {
  if (action.type === AUTH_LOGOUT) {
    // // 1. Reset Redux state
    store.dispatch({ type: RESET_STATE });

    // 2. Clear local storage
    storage.clearAll();

    // 3. Cancel RTK Query requests & clear cache
    store.dispatch(baseApi.util.resetApiState());
  }

  return next(action);
};
