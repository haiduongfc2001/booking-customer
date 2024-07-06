import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // This will use localStorage
import alertSlice from "../slices/alert-slice";
import loadingSlice from "../slices/loading-slice";
import authSlice from "../slices/auth-slice";
import searchSlice from "../slices/search-slice";

const rootReducer = combineReducers({
  alert: alertSlice,
  loading: loadingSlice,
  auth: authSlice,
  search: searchSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["alert", "loading", "auth", "search"], // List of reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
