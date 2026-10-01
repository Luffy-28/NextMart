import { apiProcessor } from "../../helpers/axiosHelper.js";

const BASE = import.meta.env.VITE_ROOT_URL;

// Submit a review for a product from a specific delivered order
export const addReviewApi = async (orderId, productId, reviewData) => {
  return apiProcessor({
    url: `${BASE}/api/v1/reviews/${orderId}/${productId}`,
    method: "POST",
    isPrivate: true,
    data: reviewData,
  });
};

// Get all approved reviews for a product (only approved ones returned by backend)
export const getProductReviewsApi = async (productId) => {
  return apiProcessor({
    url: `${BASE}/api/v1/reviews/product/${productId}`,
    method: "GET",
  });
};

// Update an existing review
export const updateReviewApi = async (reviewId, reviewData) => {
  return apiProcessor({
    url: `${BASE}/api/v1/reviews/${reviewId}`,
    method: "PUT",
    isPrivate: true,
    data: reviewData,
  });
};

// Delete a review
export const deleteReviewApi = async (reviewId) => {
  return apiProcessor({
    url: `${BASE}/api/v1/reviews/${reviewId}`,
    method: "DELETE",
    isPrivate: true,
  });
};
