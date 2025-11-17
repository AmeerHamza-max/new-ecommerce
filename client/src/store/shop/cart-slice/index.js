// src/store/shop/cart-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/shop/cart";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// -----------------------------
// Async Thunks
// -----------------------------

// Fetch Cart Items
const fetchCart = createAsyncThunk(
  "shoppingCart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/get/${userId}`);
      return response.data.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Add Item to Cart
const addCartItem = createAsyncThunk(
  "shoppingCart/addCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/add`, { userId, productId, quantity });
      return response.data.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add item");
    }
  }
);

// Update Item Quantity
const updateCartItem = createAsyncThunk(
  "shoppingCart/updateCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/update`, { userId, productId, quantity });
      return response.data.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update item quantity");
    }
  }
);

// Decrease Item Quantity by 1
const decreaseCartItem = createAsyncThunk(
  "shoppingCart/decreaseCartItem",
  async ({ userId, productId }, { rejectWithValue, getState }) => {
    try {
      const { shoppingCart } = getState();
      const item = shoppingCart.cartItems.find((i) => i.productId === productId);
      if (!item || item.quantity <= 1) return shoppingCart.cartItems; // nothing to decrease
      const response = await axios.put(`${API_BASE}/update`, {
        userId,
        productId,
        quantity: item.quantity - 1,
      });
      return response.data.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to decrease quantity");
    }
  }
);

// Delete Item from Cart
const deleteCartItem = createAsyncThunk(
  "shoppingCart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE}/${userId}/${productId}`);
      return response.data.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete item");
    }
  }
);

// Safe fetch for frontend (returns empty array on error)
const fetchCartItemsSafe = createAsyncThunk(
  "shoppingCart/fetchCartItemsSafe",
  async (userId, { dispatch }) => {
    try {
      return await dispatch(fetchCart(userId)).unwrap();
    } catch {
      return [];
    }
  }
);

// -----------------------------
// Slice
// -----------------------------
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- Fetch ----------------
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // ---------------- Add ----------------
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // ---------------- Update ----------------
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // ---------------- Decrease ----------------
      .addCase(decreaseCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // ---------------- Delete ----------------
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // ---------------- Errors ----------------
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          !action.type.includes("fetchCartItemsSafe"),
        (state, action) => {
          state.error = action.payload;
        }
      )

      // ---------------- Loading ----------------
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

// -----------------------------
// Exports
// -----------------------------
export const {
  clearCart,
} = shoppingCartSlice.actions;

export {
  fetchCart,
  addCartItem,
  updateCartItem,
  decreaseCartItem,
  deleteCartItem,
  fetchCartItemsSafe,
};

export default shoppingCartSlice.reducer;
