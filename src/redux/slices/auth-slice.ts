import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  lastLoginTime: string | null;
  customer_id: string | null;
  email: string | null;
  avatar: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  lastLoginTime: null,
  customer_id: null,
  email: null,
  avatar: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        customer_id: string;
        email: string;
        avatar: string;
      }>
    ) => {
      state.customer_id = action.payload.customer_id;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.lastLoginTime = new Date().toISOString();
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.customer_id = null;
      state.email = null;
      state.avatar = null;
      state.lastLoginTime = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
