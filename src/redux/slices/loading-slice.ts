import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  data: {
    isLoading: boolean | null;
  };
}

const initialState: LoadingState = {
  data: {
    isLoading: null,
  },
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    openLoadingApi: (state) => {
      state.data.isLoading = true;
    },
    closeLoadingApi: (state) => {
      state.data.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openLoadingApi, closeLoadingApi } = loadingSlice.actions;

export default loadingSlice.reducer;
