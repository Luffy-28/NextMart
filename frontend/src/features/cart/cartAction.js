import { setCart, clearItem, setLoading } from "./cartSlice.js";
import {
  fetchCartApi,
  addTOCartApi,
  updateCartApi,
  removeFromCartApi,
  clearCartApi,
} from "./cartApis.js";

// Fetch cart from backend — dispatches full cart (items + totalAmount)
export const getCart = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await fetchCartApi();
    if (data.status === "success") {
      dispatch(setCart(data.data));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add item to cart — backend returns updated cart, sync full cart
export const addToCart = (cartData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await addTOCartApi(cartData);
    if (data.status === "success") {
      dispatch(setCart(data.data));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update quantity of an existing cart item
export const updateCartQuantity = (cartData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await updateCartApi(cartData);
    if (data.status === "success") {
      dispatch(setCart(data.data));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Remove a single item from cart by productId
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await removeFromCartApi(productId);
    if (data.status === "success") {
      dispatch(setCart(data.data));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Clear the entire cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await clearCartApi();
    if (data.status === "success") {
      dispatch(clearItem());
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};
