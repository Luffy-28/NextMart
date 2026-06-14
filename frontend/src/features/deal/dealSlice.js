import { createSlice } from "@reduxjs/toolkit";

const dealSlice = createSlice({
  name: "deal",
  initialState: {
    deals: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDeals,
  setLoading,
  setError,
} = dealSlice.actions;

export default dealSlice.reducer;
