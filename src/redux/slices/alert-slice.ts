import {
  ALERT_TYPE,
  AlertTitles,
  AlertStatus,
  AlertState,
} from "@/constant/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AlertState = {
  isOpen: false,
  title: "Error",
  message: "This is an error",
  type: ALERT_TYPE.ERROR,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    closeAlert: (state) => {
      state.isOpen = false;
      state.type = ALERT_TYPE.ERROR;
      state.title = "";
      state.message = "";
    },
    openAlert: (state, action: PayloadAction<Partial<AlertState>>) => {
      state.isOpen = true;
      state.title =
        action.payload.title || AlertTitles[action.payload.type as ALERT_TYPE];
      state.message = action.payload.message || "";
      state.type = action.payload.type || ALERT_TYPE.ERROR;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
