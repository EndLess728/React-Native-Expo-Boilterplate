import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import userSlicer from "../slices/userSlicer";

const rootReducer = combineReducers({
  user: userSlicer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
