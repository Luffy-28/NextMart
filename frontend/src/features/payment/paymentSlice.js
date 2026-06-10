import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    // Payment intent
    clientSecret: null,
    paymentIntentId: null,

    // Addresses
    addresses: [],
    selectedAddressId: null,

    // UI flags
    loading: false,
    error: null,
    paymentStatus: null, // null | 'pending' | 'succeeded' | 'failed'
  },
  reducers: {
    // Addresses
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    setSelectedAddressId: (state, action) => {
      state.selectedAddressId = action.payload;
    },

    // Payment intent
    setPaymentIntent: (state, action) => {
      state.clientSecret = action.payload.clientSecret;
      state.paymentIntentId = action.payload.paymentIntentId;
    },
    clearPaymentIntent: (state) => {
      state.clientSecret = null;
      state.paymentIntentId = null;
    },
    // Status
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Full reset after checkout completes
    resetPayment: (state) => {
      state.clientSecret = null;
      state.paymentIntentId = null;
      state.pendingOrderId = null;
      state.paymentStatus = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAddresses,
  addAddress,
  setSelectedAddressId,
  setPaymentIntent,
  clearPaymentIntent,
  setPaymentStatus,
  setLoading,
  setError,
  resetPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;