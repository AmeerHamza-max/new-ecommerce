// --- src/store/user-orders-slice.js ---

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// TEMP MOCK API (Replace with real axios instance later)
const api = { 
    get: async (url) => { 
        console.log(`[USER_SLICE] Fetching from: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (url.includes('123')) {
             return { 
                data: [
                    { _id: 'o101', orderId: 'U-00101', totalAmount: 55.99, items: [{name: 'A'}], status: 'Delivered', createdAt: Date.now() - 86400000 },
                    { _id: 'o102', orderId: 'U-00102', totalAmount: 120.00, items: [{name: 'B'}, {name: 'C'}], status: 'Processing', createdAt: Date.now() - 3600000 },
                ] 
            };
        }
        return { data: [] };
    },
};

// --------------------------------------------------
// THUNK: Fetch orders for a specific user
// --------------------------------------------------

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID missing');
      }

      // Replace with real backend call later:
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch orders'
      );
    }
  }
);

// --------------------------------------------------
// SLICE
// --------------------------------------------------

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
        state.orders = [];
      });
  },
});

// --------------------------------------------------
// SELECTORS (Memoized)
// --------------------------------------------------

// Base selector
const selectUserOrdersSlice = (state) => state.userOrders;

// Memoized selector
export const selectUserOrdersState = createSelector(
  [selectUserOrdersSlice],
  (userOrders) => userOrders
);

// Optional helper selectors
export const selectUserOrders = createSelector(
  [selectUserOrdersSlice],
  (userOrders) => userOrders.orders
);

export const selectUserOrdersLoading = createSelector(
  [selectUserOrdersSlice],
  (userOrders) => userOrders.isLoading
);

export const selectUserOrdersError = createSelector(
  [selectUserOrdersSlice],
  (userOrders) => userOrders.error
);

export default userOrdersSlice.reducer;
