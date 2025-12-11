import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// -------------------------
// Import Reducers
// -------------------------
import authReducer from "./auth-slice/index.js";
import adminProductsReducer from "./admin/product-slice";
import shopProductSlice from "./shop/product-slice";
import shoppingCartReducer from "./shop/cart-slice";
import contactReducer from "./contactSlice/index.js";
import shopAdressSlice from "./shop/address-slice";
import orderReducer from "./order-slice.js";
import viewOrderReducer from "./view-order-slice.js";

// NEW: Import orders slices
import userOrdersReducer from "./user-orders-slice.js";
import adminOrdersReducer from "./admin-orders-slice.js";

// -------------------------
// Redux Persist Configuration for Address Slice
// -------------------------
const addressPersistConfig = {
  key: "shopAddress",
  storage,
  whitelist: ["addressList"],
};

// -------------------------
// Combine All Reducers
// -------------------------
const rootReducer = combineReducers({
  auth: authReducer,
  adminProducts: adminProductsReducer,
  shopProducts: shopProductSlice,
  shoppingCart: shoppingCartReducer,
  contact: contactReducer,
  orders: orderReducer, // optional / generic order
  viewOrder: viewOrderReducer,
  shopAddress: persistReducer(addressPersistConfig, shopAdressSlice),
  userOrders: userOrdersReducer,   // ← added
  adminOrders: adminOrdersReducer, // ← added
});

// -------------------------
// Configure Store
// -------------------------
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Optional: debug
store.subscribe(() => {
  // console.log("[Redux Store] Current State:", store.getState());
});
