import { combineReducers } from "@reduxjs/toolkit";
import { emptyApi } from "../services/emptyApi";
import userSlicer from "../slices/userSlicer";

const rootReducer = combineReducers({
  user: userSlicer,
  [emptyApi.reducerPath]: emptyApi.reducer,
});

export default rootReducer;
