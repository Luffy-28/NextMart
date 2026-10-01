import {
  addReviewApi,
  getProductReviewsApi,
  updateReviewApi,
  deleteReviewApi,
} from "./reviewApis.js";
import {
  setProductReviews, setLoading, setSubmitting,
  setError, setSuccess, clearMessages,
  removeReview, updateReviewInList,
} from "./reviewSlice.js";

// Fetch all approved reviews for a product
export const getProductReviews = (productId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getProductReviewsApi(productId);
    if (response.status === "success") {
      dispatch(setProductReviews(response.data));
    } else {
      // 404 just means no reviews yet — that's fine
      dispatch(setProductReviews([]));
    }
  } catch (error) {
    dispatch(setProductReviews([]));
  } finally {
    dispatch(setLoading(false));
  }
};

// Submit a new review for a product
// orderId is required — backend only allows reviewing delivered orders
export const addReview = (orderId, productId, reviewData) => async (dispatch) => {
  try {
    dispatch(clearMessages());
    dispatch(setSubmitting(true));
    const response = await addReviewApi(orderId, productId, reviewData);
    if (response.status === "success") {
      dispatch(setSuccess("Your review has been submitted and is pending approval."));
      return true;
    } else {
      dispatch(setError(response.message || "Failed to submit review"));
      return false;
    }
  } catch (error) {
    dispatch(setError("Failed to submit review"));
    return false;
  } finally {
    dispatch(setSubmitting(false));
  }
};

// Update an existing review
export const updateReview = (reviewId, reviewData) => async (dispatch) => {
  try {
    dispatch(clearMessages());
    dispatch(setSubmitting(true));
    const response = await updateReviewApi(reviewId, reviewData);
    if (response.status === "success") {
      dispatch(updateReviewInList(response.data));
      dispatch(setSuccess("Review updated successfully."));
      return true;
    } else {
      dispatch(setError(response.message || "Failed to update review"));
      return false;
    }
  } catch (error) {
    dispatch(setError("Failed to update review"));
    return false;
  } finally {
    dispatch(setSubmitting(false));
  }
};

// Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await deleteReviewApi(reviewId);
    if (response.status === "success") {
      dispatch(removeReview(reviewId));
      return true;
    }
    return false;
  } catch (error) {
    dispatch(setError("Failed to delete review"));
    return false;
  }
};
