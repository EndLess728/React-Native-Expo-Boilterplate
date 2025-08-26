import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import userSlicer from "../slices/userSlicer";
import { RESET_STATE } from "../types";

const appReducer = combineReducers({
  user: userSlicer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Root reducer with reset capability
const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    // Return undefined to reset all state
    return undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
