import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------------
// Async Thunk: Create Order
// ---------------------------
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create-order",
        orderData
      );
      return response.data;
    } catch (error) {
      console.error("[createOrder] error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ---------------------------
// Slice
// ---------------------------
const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    isLoading: false,
    error: null,
    success: false
  },
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      // Fulfilled
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order || null;
        state.success = true;
      })
      // Rejected
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Order creation failed";
        state.success = false;
      });
  }
});

// ---------------------------
// Exports
// ---------------------------
export const { clearOrderState } = orderSlice.actions;

export const selectOrderState = (state) => state.order;

export default orderSlice.reducer;
