import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counter-slice";
import alertSlice from "./slices/alert-slice";
import loadingSlice from "./slices/loading-slice";
import authSlice from "./slices/auth-slice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    alert: alertSlice,
    loading: loadingSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
