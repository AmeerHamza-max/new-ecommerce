import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/shop";

// ---------------------------
// ASYNC THUNKS
// ---------------------------

// Fetch all products, including search query
export const fetchAllProducts = createAsyncThunk(
  "shopProducts/fetchAllProducts",
  // search parameter add kiya gaya
  async ({ category = [], brand = [], sortBy = "price-lowtoHigh", search = "" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category.length) params.append("category", category.join(","));
      if (brand.length) params.append("brand", brand.join(","));
      if (sortBy) params.append("sortBy", sortBy);
      
      // Search term ko API call ke params mein add kiya gaya
      if (search.trim()) params.append("search", search.trim()); 

      const { data } = await axios.get(`${API_URL}/products/get?${params.toString()}`, { withCredentials: true });
      console.log("[fetchAllProducts] Response:", data);
      return data;
    } catch (err) {
      console.error("[fetchAllProducts] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch products" });
    }
  }
);

// Fetch single product
export const fetchProductDetails = createAsyncThunk(
  "shopProducts/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`, { withCredentials: true });
      console.log("[fetchProductDetails] Response:", data);
      return data;
    } catch (err) {
      console.error("[fetchProductDetails] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch product details" });
    }
  }
);

// Fetch product reviews
export const fetchProductReviews = createAsyncThunk(
  "shopProducts/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${productId}/reviews`, { withCredentials: true });
      console.log("[fetchProductReviews] Response:", data);
      return data.data || [];
    } catch (err) {
      console.error("[fetchProductReviews] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch reviews" });
    }
  }
);

// Add product review
export const addProductReview = createAsyncThunk(
  "shopProducts/addProductReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/products/${productId}/reviews`, reviewData, { withCredentials: true });
      console.log("[addProductReview] Response:", data);
      return data.updatedProduct;
    } catch (err) {
      console.error("[addProductReview] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to post review" });
    }
  }
);

// Edit product review
export const editProductReviewThunk = createAsyncThunk(
  "shopProducts/editProductReview",
  async ({ productId, reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/products/${productId}/reviews/${reviewId}`, reviewData, { withCredentials: true });
      console.log("[editProductReviewThunk] Response:", data);
      return { reviewId, updatedReview: data.data };
    } catch (err) {
      console.error("[editProductReviewThunk] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to edit review" });
    }
  }
);

// Delete product review
export const deleteProductReviewThunk = createAsyncThunk(
  "shopProducts/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}/reviews/${reviewId}`, { withCredentials: true });
      console.log("[deleteProductReviewThunk] Success, reviewId:", reviewId);
      return reviewId;
    } catch (err) {
      console.error("[deleteProductReviewThunk] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to delete review" });
    }
  }
);

// ---------------------------
// SLICE
// ---------------------------
const initialState = {
  loading: false,
  productList: [],
  productDetails: null,
  productReviews: [],
  error: null,
};

const shopProductSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.productList = [];
      state.productDetails = null;
      state.productReviews = [];
      state.error = null;
      state.loading = false;
      console.log("[clearProducts] Cleared state");
    },
    updateRating: (state, action) => {
      const { productId, rating } = action.payload;
      state.productList = state.productList.map((p) => (p._id === productId ? { ...p, rating } : p));
      if (state.productDetails?._id === productId) state.productDetails.rating = rating;
      console.log("[updateRating] Updated product rating:", productId, rating);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => { state.loading = true; state.error = null; console.log("[fetchAllProducts] Pending..."); })
      .addCase(fetchAllProducts.fulfilled, (state, action) => { state.loading = false; state.productList = action.payload.data || []; console.log("[fetchAllProducts] Fulfilled, products:", state.productList.length); })
      .addCase(fetchAllProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.payload; console.error("[fetchAllProducts] Rejected:", state.error); })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; state.error = null; console.log("[fetchProductDetails] Pending..."); })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload.data || null;
        state.productReviews = action.payload.data?.reviews || [];
        console.log("[fetchProductDetails] Fulfilled, productId:", action.payload.data?._id);
      })
      .addCase(fetchProductDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.payload; console.error("[fetchProductDetails] Rejected:", state.error); })

      // Fetch reviews
      .addCase(fetchProductReviews.pending, (state) => { state.loading = true; console.log("[fetchProductReviews] Pending..."); })
      .addCase(fetchProductReviews.fulfilled, (state, action) => { state.loading = false; state.productReviews = action.payload || []; console.log("[fetchProductReviews] Fulfilled, reviews count:", state.productReviews.length); })
      .addCase(fetchProductReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.payload; console.error("[fetchProductReviews] Rejected:", state.error); })

      // Add review
      .addCase(addProductReview.pending, (state) => { state.loading = true; console.log("[addProductReview] Pending..."); })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload.reviews || [];
        console.log("[addProductReview] Fulfilled, new reviews count:", state.productReviews.length);
      })
      .addCase(addProductReview.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.payload; console.error("[addProductReview] Rejected:", state.error); })

      // Edit review
      .addCase(editProductReviewThunk.fulfilled, (state, action) => {
        const { reviewId, updatedReview } = action.payload;
        state.productReviews = state.productReviews.map((rev) => (rev._id === reviewId ? updatedReview : rev));
        if (state.productDetails?.reviews) {
          state.productDetails.reviews = state.productDetails.reviews.map((rev) => (rev._id === reviewId ? updatedReview : rev));
        }
        console.log("[editProductReviewThunk] Fulfilled, reviewId:", reviewId);
      })

      // Delete review
      .addCase(deleteProductReviewThunk.fulfilled, (state, action) => {
        state.productReviews = state.productReviews.filter((rev) => rev._id !== action.payload);
        if (state.productDetails?.reviews) {
          state.productDetails.reviews = state.productDetails.reviews.filter((rev) => rev._id !== action.payload);
        }
        console.log("[deleteProductReviewThunk] Fulfilled, deleted reviewId:", action.payload);
      });
  },
});

export const { clearProducts, updateRating } = shopProductSlice.actions;
export default shopProductSlice.reducer;