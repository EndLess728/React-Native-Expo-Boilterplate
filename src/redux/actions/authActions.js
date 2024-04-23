import {createAsyncThunk} from '@reduxjs/toolkit';
import {UserController} from '@/controllers';
import {AUTH_LOGIN, AUTH_LOGOUT} from '../types';

export const login = createAsyncThunk(
  AUTH_LOGIN,
  async (body, {rejectWithValue}) => {
    try {
      const res = await UserController.login(body);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logout = createAsyncThunk(
  AUTH_LOGOUT,
  async (params, {rejectWithValue}) => {
    try {
      const res = await UserController.logout(params);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
