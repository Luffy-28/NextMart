import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],        // array of populated product objects
    loading: false,
    error: null,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Optimistically remove a product so the UI feels instant
    removeItem: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
  },
});

export const { setWishlist, setLoading, setError, removeItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
