import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  location: string | null;
  checkIn: string | null;
  checkOut: string | null;
  numRooms: number | null;
  numAdults: number | null;
  numChildren: number | null;
  chidlrenAges: number[];
}

const initialState: SearchState = {
  location: null,
  checkIn: null,
  checkOut: null,
  numRooms: null,
  numAdults: null,
  numChildren: null,
  chidlrenAges: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        location: string;
        checkIn: string;
        checkOut: string;
        numRooms: number;
        numAdults: number;
        numChildren: number;
        chidlrenAges: number[];
      }>
    ) => {
      state.location = action.payload.location;
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
      state.numRooms = action.payload.numRooms;
      state.numAdults = action.payload.numAdults;
      state.numChildren = action.payload.numChildren;
      state.chidlrenAges = action.payload.chidlrenAges;
    },
    logout: (state) => {
      state.location = null;
      state.checkIn = null;
      state.checkOut = null;
      state.numRooms = null;
      state.numAdults = null;
      state.numChildren = null;
      state.chidlrenAges = [];
    },
  },
});

export const { login, logout } = searchSlice.actions;

export default searchSlice.reducer;
