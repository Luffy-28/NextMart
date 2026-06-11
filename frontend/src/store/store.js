import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.js";
import themeReducer from "../features/theme/themeSlice.js";
import productReducer from "../features/product/productSlice.js";
import categoryReducer from "../features/category/categorySlice.js";
import subCategoryReducer from "../features/subCategory/subCategorySlice.js";
import cartReducer from "../features/cart/cartSlice.js";
import paymentReducer from "../features/payment/paymentSlice.js";
import orderReducer from "../features/order/orderSlice.js";
import addressReducer from "../features/address/addressSlice.js";

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    themeStore: themeReducer,
    productStore: productReducer,
    categoryStore: categoryReducer,
    subCategoryStore: subCategoryReducer,
    cartStore: cartReducer,
    paymentStore: paymentReducer,
    orderStore: orderReducer,
    addressStore: addressReducer,
  },
});
