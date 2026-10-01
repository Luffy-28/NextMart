import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from "./wishlistApis.js";
import { setWishlist, setLoading, setError, removeItem } from "./wishlistSlice.js";

// Load the user's wishlist
export const getWishlist = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getWishlistApi();
    if (response.status === "success") {
      dispatch(setWishlist(response.data));
    }
  } catch (error) {
    dispatch(setError("Failed to load wishlist"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a product — reloads the list so it stays in sync with the server
export const addToWishlist = (productId) => async (dispatch) => {
  try {
    const response = await addToWishlistApi(productId);
    if (response.status === "success") {
      dispatch(setWishlist(response.data));
      return true;
    }
    return false;
  } catch (error) {
    dispatch(setError("Failed to add to wishlist"));
    return false;
  }
};

// Remove a product — optimistic remove first, then syncs from server response
export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(removeItem(productId)); // instant UI update
    const response = await removeFromWishlistApi(productId);
    if (response.status === "success") {
      dispatch(setWishlist(response.data)); // sync with server
      return true;
    }
    return false;
  } catch (error) {
    dispatch(setError("Failed to remove from wishlist"));
    return false;
  }
};

// Clear everything
export const clearWishlist = () => async (dispatch) => {
  try {
    await clearWishlistApi();
    dispatch(setWishlist([]));
    return true;
  } catch (error) {
    dispatch(setError("Failed to clear wishlist"));
    return false;
  }
};
