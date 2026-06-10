import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    pendingOrderId: null,
    placedOrder: null,
    paymentStatus: null,
    orderStatus: null,
     error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setPendingOrderId: (state, action) => {
      state.pendingOrderId = action.payload;
    },
        clearPendingOrder: (state) => {
      state.pendingOrderId = null;
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
    setError: (state,action) =>{
      state.error = action.payload;
    }
  },
});

export const { setOrders,setError, setPendingOrderId,setPlacedOrder, setPaymentStatus, setOrderStatus,clearPendingOrder } = orderSlice.actions;
export default orderSlice.reducer;
