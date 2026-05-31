import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0
  },
  reducers: {
    // Syncs full cart from backend response (items + totalAmount)
    setCart: (state, action) => {
      const items = action.payload?.items || [];
      state.items = items;
      state.totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.totalAmount = action.payload?.totalAmount || 0;
    },
    // Empties the cart locally (used after clearCart API succeeds)
    clearItem: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { setCart, clearItem } = cartSlice.actions;
export default cartSlice.reducer;