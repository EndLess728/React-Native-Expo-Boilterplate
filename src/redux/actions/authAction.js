import { createAction } from "@reduxjs/toolkit";
import { AUTH_LOGOUT } from "../types";

export const logout = createAction(AUTH_LOGOUT);
