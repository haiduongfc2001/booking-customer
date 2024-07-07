import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  location: string | null;
  checkIn: string | null;
  checkOut: string | null;
  numRooms: number | null;
  numAdults: number | null;
  numChildren: number | null;
  childrenAges: number[];
}

const initialState: SearchState = {
  location: "Thành phố hà Nội",
  checkIn: null,
  checkOut: null,
  numRooms: null,
  numAdults: null,
  numChildren: null,
  childrenAges: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchHotel: (
      state,
      action: PayloadAction<{
        location: string;
        checkIn: string;
        checkOut: string;
        numRooms: number;
        numAdults: number;
        numChildren: number;
        childrenAges: number[];
      }>
    ) => {
      state.location = action.payload.location;
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
      state.numRooms = action.payload.numRooms;
      state.numAdults = action.payload.numAdults;
      state.numChildren = action.payload.numChildren;
      state.childrenAges = action.payload.childrenAges;
    },
    updateSearchParams: (
      state,
      action: PayloadAction<Partial<SearchState>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { searchHotel, updateSearchParams } = searchSlice.actions;

export default searchSlice.reducer;
