import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------------
// Base API URL
// -------------------------
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/orders";

// -------------------------
// Async Thunks
// -------------------------

// Create a new order
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/`, orderData);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all orders for a user
export const fetchUserOrders = createAsyncThunk(
  "payment/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/user/${userId}`);
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch single order by ID
export const fetchSingleOrder = createAsyncThunk(
  "payment/fetchSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/${orderId}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Admin: Update order status
export const updateOrderStatus = createAsyncThunk(
  "payment/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/${orderId}/status`, { status });
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// -------------------------
// Initial State
// -------------------------
const initialState = {
  orders: [],
  orderDetails: null,
  isLoading: false,
  error: null,
  success: false,
};

// -------------------------
// Slice
// -------------------------
const orderSlice = createSlice({
  name: "payment", // store key
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.orders = [];
      state.orderDetails = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.orderDetails = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create order";
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch user orders";
      })

      // Fetch single order
      .addCase(fetchSingleOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch order details";
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        // Update orders array
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;

        // Update orderDetails if it's the same
        if (state.orderDetails?._id === action.payload._id) state.orderDetails = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update order status";
      });
  },
});

// -------------------------
// Exports
// -------------------------
export const { clearOrderState } = orderSlice.actions;
export const selectOrderState = (state) => state.payment; // store key is "payment"
export default orderSlice.reducer;
