// --- src/store/admin-orders-slice.js ---

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// TEMP MOCK API (Replace with real axios instance later)
const api = { 
    get: async (url) => { 
        console.log(`[ADMIN_SLICE] Fetching from: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 700));

        // Mock all orders
        return { 
            data: [
                { _id: 'o100', orderId: 'A-00100', customerName: 'Rohan Sharma', totalAmount: 45.00, status: 'Pending', paymentMethod: 'Card', createdAt: Date.now() - 100000000 },
                { _id: 'o101', orderId: 'A-00101', customerName: 'Priya Verma', totalAmount: 55.99, status: 'Delivered', paymentMethod: 'COD', createdAt: Date.now() - 86400000 },
                { _id: 'o102', orderId: 'A-00102', customerName: 'Amit Singh', totalAmount: 120.00, status: 'Processing', paymentMethod: 'Card', createdAt: Date.now() - 3600000 },
                { _id: 'o103', orderId: 'A-00103', customerName: 'Zoya Khan', totalAmount: 300.50, status: 'Cancelled', paymentMethod: 'COD', createdAt: Date.now() - 1200000 },
            ] 
        };
    },
    patch: async (url, data) => {
        console.log(`[ADMIN_SLICE] Updating ${url} with status: ${data.status}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { 
            data: { _id: 'o101', orderId: data.orderId, totalAmount: 55.99, status: data.status, customerName: 'Priya Verma', paymentMethod: 'COD', createdAt: Date.now() } 
        };
    }
};

// --------------------------------------------------
// THUNKS
// --------------------------------------------------

export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch all orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      if (!orderId || !status) throw new Error('Order ID or status missing');

      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data; // Updated order object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update order status');
    }
  }
);

// --------------------------------------------------
// SLICE
// --------------------------------------------------

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchAllOrders ---
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- updateOrderStatus ---
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload;

        state.orders = state.orders.map(order =>
          order._id === updatedOrder._id || order.orderId === updatedOrder.orderId
            ? updatedOrder
            : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// --------------------------------------------------
// SELECTORS (Memoized)
// --------------------------------------------------

const selectAdminOrdersSlice = (state) => state.adminOrders;

export const selectAdminOrdersState = createSelector(
  [selectAdminOrdersSlice],
  (adminOrders) => adminOrders
);

export const selectAdminOrders = createSelector(
  [selectAdminOrdersSlice],
  (adminOrders) => adminOrders.orders
);

export const selectAdminOrdersLoading = createSelector(
  [selectAdminOrdersSlice],
  (adminOrders) => adminOrders.isLoading
);

export const selectAdminOrdersError = createSelector(
  [selectAdminOrdersSlice],
  (adminOrders) => adminOrders.error
);

export default adminOrdersSlice.reducer;
