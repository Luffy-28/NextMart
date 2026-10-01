import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    // Reviews for the currently viewed product
    productReviews: [],
    loading: false,
    submitting: false,  // separate flag for submit button
    error: null,
    success: null,
  },
  reducers: {
    setProductReviews: (state, action) => {
      state.productReviews = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action) => {
      state.submitting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.submitting = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error   = null;
      state.success = null;
    },
    // Remove a review from the list after deletion
    removeReview: (state, action) => {
      state.productReviews = state.productReviews.filter((r) => r._id !== action.payload);
    },
    // Update a review in the list after edit
    updateReviewInList: (state, action) => {
      const idx = state.productReviews.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.productReviews[idx] = action.payload;
    },
  },
});

export const {
  setProductReviews, setLoading, setSubmitting,
  setError, setSuccess, clearMessages,
  removeReview, updateReviewInList,
} = reviewSlice.actions;

export default reviewSlice.reducer;
