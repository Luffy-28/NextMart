import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    themeStore: themeReducer,
  },
});
