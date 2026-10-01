import { apiProcessor } from "../../helpers/axiosHelper.js";

const BASE = import.meta.env.VITE_ROOT_URL;

// Get the user's wishlist
export const getWishlistApi = async () => {
  return apiProcessor({
    url: `${BASE}/api/v1/wishlist`,
    method: "GET",
    isPrivate: true,
  });
};

// Add a product to the wishlist
export const addToWishlistApi = async (productId) => {
  return apiProcessor({
    url: `${BASE}/api/v1/wishlist/add/${productId}`,
    method: "POST",
    isPrivate: true,
  });
};

// Remove a product from the wishlist
export const removeFromWishlistApi = async (productId) => {
  return apiProcessor({
    url: `${BASE}/api/v1/wishlist/remove/${productId}`,
    method: "DELETE",
    isPrivate: true,
  });
};

// Clear the entire wishlist
export const clearWishlistApi = async () => {
  return apiProcessor({
    url: `${BASE}/api/v1/wishlist/clear`,
    method: "DELETE",
    isPrivate: true,
  });
};
