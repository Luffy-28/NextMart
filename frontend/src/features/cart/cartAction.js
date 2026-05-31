import { setCart, clearItem } from "./cartSlice.js";
import {
  fetchCartApi,
  addTOCartApi,
  updateCartApi,
  removeFromCartApi,
  clearCartApi,
} from "./cartApis.js";

// Fetch cart from backend — dispatches full cart (items + totalAmount)
export const getCart = () => async (dispatch) => {
  const data = await fetchCartApi();
  if (data.status === "success") {
    dispatch(setCart(data.data));
    return data;
  }
};

// Add item to cart — backend returns updated cart, sync full cart
export const addToCart = (cartData) => async (dispatch) => {
  const data = await addTOCartApi(cartData);
  if (data.status === "success") {
    dispatch(setCart(data.data));
    return data;
  }
};

// Update quantity of an existing cart item
export const updateCartQuantity = (cartData) => async (dispatch) => {
  const data = await updateCartApi(cartData);
  if (data.status === "success") {
    dispatch(setCart(data.data));
    return data;
  }
};

// Remove a single item from cart by productId
export const removeFromCart = (productId) => async (dispatch) => {
  const data = await removeFromCartApi(productId);
  if (data.status === "success") {
    dispatch(setCart(data.data));
    return data;
  }
};

// Clear the entire cart
export const clearCart = () => async (dispatch) => {
  const data = await clearCartApi();
  if (data.status === "success") {
    dispatch(clearItem());
    return data;
  }
};
