// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductsReducer from "./admin/product-slice";
import shopProductSlice from "./shop/product-slice";
import shoppingCartReducer from './shop/cart-slice';
import contactReducer from './contactSlice/index.js'; // ← added contact slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shopProducts: shopProductSlice,
    shoppingCart: shoppingCartReducer,
    contact: contactReducer, // ← added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allows non-serializable data in actions
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Debug: log every state change
store.subscribe(() => {
  console.log("[Redux Store] Current State:", store.getState());
});

export default store;
