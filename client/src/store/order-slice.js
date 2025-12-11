import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// BASE_URL: Apne backend server ka address yahan daalein.
// Agar aapka backend localhost:5000 par chal raha hai:
const BASE_URL = 'http://localhost:5000'; 
// Agar aapka backend aur frontend same server par hain, toh BASE_URL = ''; bhi chalega.

// === Utility Function for Fetch API ===
// Yeh function fetch call karega, JSON mein parse karega aur HTTP errors (4xx/5xx) ko handle karega.
const fetcher = async (url, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // Agar aap authentication use kar rahe hain, toh 'Authorization' token yahan add karein.
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    const response = await fetch(url, config);

    if (!response.ok) {
        let errorData = {};
        try {
            // Error response se JSON data lene ki koshish
            errorData = await response.json();
        } catch {
            // Agar JSON parse nahi ho paya, toh generic error message
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const errorMessage = errorData.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    return response.json();
};
// ======================================


// ==========================================================
// Async Thunks (API Calls - Updated to use fetcher)
// ==========================================================

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const url = `${BASE_URL}/api/orders`;
            const response = await fetcher(url, {
                method: 'POST',
                body: JSON.stringify(orderData),
            });
            // Aapke backend ke response structure ke mutabiq, yeh .order ya direct response ho sakta hai
            return response.order || response; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const url = `${BASE_URL}/api/orders/user/${userId}`;
            const response = await fetcher(url);
            return response.orders; // Assuming the response contains an 'orders' array
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchOrderDetails',
    async (orderId, { rejectWithValue }) => {
        try {
            const url = `${BASE_URL}/api/orders/${orderId}`;
            const response = await fetcher(url);
            return response.order; // Assuming the response contains an 'order' object
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==========================================================
// Order Slice Definition (NO CHANGE)
// ==========================================================

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        userOrders: [],
        orderDetail: null,
        currentOrder: null,
        status: 'idle', 
        error: null,
    },
    reducers: {
        clearOrderDetail: (state) => {
            state.orderDetail = null;
        },
        clearOrderState: (state) => {
            state.currentOrder = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Handlers for createOrder ---
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; 
                state.currentOrder = null;
            })
            
            // --- Handlers for fetchUserOrders ---
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userOrders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; 
                state.userOrders = []; 
            })
            
            // --- Handlers for fetchOrderDetails ---
            .addCase(fetchOrderDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.orderDetail = null; 
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orderDetail = action.payload; 
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.orderDetail = null;
            });
    },
});

// ==========================================================
// Selectors (NO CHANGE)
// ==========================================================

export const selectUserOrders = (state) => state.orders.userOrders;
export const selectOrderDetail = (state) => state.orders.orderDetail;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export const selectOrderState = (state) => ({ 
    isLoading: state.orders.status === 'loading',
    error: state.orders.error,
    currentOrder: state.orders.currentOrder,
});


export const { clearOrderDetail, clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;