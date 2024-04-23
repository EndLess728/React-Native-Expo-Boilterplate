import { createSlice } from "@reduxjs/toolkit";
import { TYPES } from "@/actions/GlobalActions";
import { STATUS } from "@/constants";

const { ERROR, LOADING, NOT_STARTED, SUCCESS } = STATUS;

const initialState = {};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    resetStatus(state, action) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("_REQUEST"),
        (state, action) => {
          const requestName = action.type.replace("_REQUEST", "");
          state[requestName] = LOADING;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("_ERROR"),
        (state, action) => {
          const requestName = action.type.replace("_ERROR", "");
          state[requestName] = ERROR;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("_RESET"),
        (state, action) => {
          const requestName = action.type.replace("_RESET", "");
          state[requestName] = NOT_STARTED;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("_SUCCESS"),
        (state, action) => {
          const requestName = action.type.replace("_SUCCESS", "");
          state[requestName] = SUCCESS;
        }
      )
      .addCase(TYPES.GLOBAL_RESET, () => initialState);
  },
});

export const { resetStatus } = statusSlice.actions;

export default statusSlice.reducer;
