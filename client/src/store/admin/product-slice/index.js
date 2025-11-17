// src/store/admin-products-slice.js
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// -----------------------------
// Initial State
// -----------------------------
const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

// -----------------------------
// Async Thunks
// -----------------------------

// Add new product
export const addNewProduct = createAsyncThunk(
  "adminProducts/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/add",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("[addNewProduct] response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[addNewProduct] error:", error.response || error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to add product" }
      );
    }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/products/get",
        { withCredentials: true }
      );
      console.log("[fetchAllProducts] response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[fetchAllProducts] error:", error.response || error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch products" }
      );
    }
  }
);

// Edit existing product
export const editProduct = createAsyncThunk(
  "adminProducts/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/products/edit/${id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("[editProduct] response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[editProduct] error:", error.response || error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to edit product" }
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/products/delete/${id}`,
        { withCredentials: true }
      );
      console.log("[deleteProduct] response:", response.data);
      return { id, ...response.data };
    } catch (error) {
      console.error("[deleteProduct] error:", error.response || error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete product" }
      );
    }
  }
);

// -----------------------------
// Slice
// -----------------------------
const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -----------------------------
      // Fetch All
      // -----------------------------
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[Redux] fetchAllProducts pending");
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
        console.log("[Redux] fetchAllProducts fulfilled", state.productList);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch products";
        console.error("[Redux] fetchAllProducts rejected:", state.error);
      })

      // -----------------------------
      // Add Product
      // -----------------------------
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[Redux] addNewProduct pending");
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          const newProduct = action.payload.result || action.payload.product;
          if (newProduct) state.productList.unshift(newProduct);
          console.log("[Redux] addNewProduct fulfilled:", newProduct);
        }
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to add product";
        console.error("[Redux] addNewProduct rejected:", state.error);
      })

      // -----------------------------
      // Edit Product
      // -----------------------------
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[Redux] editProduct pending");
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          const updated =
            action.payload.result || action.payload.product || null;
          if (updated) {
            const index = state.productList.findIndex((p) => p._id === updated._id);
            if (index !== -1) state.productList[index] = updated;
            console.log("[Redux] editProduct fulfilled:", updated);
          }
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to edit product";
        console.error("[Redux] editProduct rejected:", state.error);
      })

      // -----------------------------
      // Delete Product
      // -----------------------------
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[Redux] deleteProduct pending");
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.productList = state.productList.filter(
            (p) => p._id !== action.payload.id
          );
          console.log("[Redux] deleteProduct fulfilled, removed ID:", action.payload.id);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete product";
        console.error("[Redux] deleteProduct rejected:", state.error);
      });
  },
});

// -----------------------------
// Export Reducer
// -----------------------------
export default adminProductsSlice.reducer;
