import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: () => {
      state.isLoggedIn = initialState.isLoggedIn;
      state.user = initialState.user;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
