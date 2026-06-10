import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    pendingOrderId: null,
    placedOrder: null,
    paymentStatus: null,
    orderStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      // Normalize: payload may be an array (getOrders) or a single object (createOrder/cancelOrder)
      state.orders = Array.isArray(action.payload)
        ? action.payload
        : state.orders;
    },
    setPendingOrderId: (state, action) => {
      state.pendingOrderId = action.payload;
    },
    clearPendingOrder: (state) => {
      state.pendingOrderId = null;
    },
    setloading: (state, action) => {
      state.loading = action.payload;
    },
    setPlacedOrder: (state, action) => {
      state.placedOrder = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setOrders,
  setError,
  setPendingOrderId,
  setPlacedOrder,
  setPaymentStatus,
  setOrderStatus,
  clearPendingOrder,
  setloading,
} = orderSlice.actions;
export default orderSlice.reducer;
