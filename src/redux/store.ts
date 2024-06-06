import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counter-slice";
import alertSlice from "./slices/alert-slice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    alert: alertSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
