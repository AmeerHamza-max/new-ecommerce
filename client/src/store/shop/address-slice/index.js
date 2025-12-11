// --- src/store/shop/address-slice/index.js ---

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -----------------------------
// Backend Base URL
// -----------------------------
const BASE_URL = "http://localhost:5000/api/shop/address";

// -----------------------------
// Thunks / Async Actions
// -----------------------------

// 1️⃣ Add New Address
export const addNewAddresses = createAsyncThunk(
  "address/addNew",
  async (formData, { rejectWithValue }) => {
    console.log("[AddressSlice] 🔹 addNewAddresses called with:", formData);
    try {
      const res = await axios.post(`${BASE_URL}/add`, formData);
      console.log("[AddressSlice] ✅ addNewAddresses response:", res.data);
      return res.data.address;
    } catch (err) {
      console.error("[AddressSlice] ❌ addNewAddresses failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2️⃣ Fetch All Addresses
export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAll",
  async (userId, { rejectWithValue }) => {
    console.log("[AddressSlice] 🔹 fetchAllAddresses called for user:", userId);
    try {
      const res = await axios.get(`${BASE_URL}/${userId}`);
      console.log("[AddressSlice] ✅ fetchAllAddresses response:", res.data);
      return res.data.addresses;
    } catch (err) {
      console.error("[AddressSlice] ❌ fetchAllAddresses failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 3️⃣ Edit Address
export const editAddress = createAsyncThunk(
  "address/edit",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    console.log("[AddressSlice] 🔹 editAddress called:", { userId, addressId, formData });
    try {
      const res = await axios.put(`${BASE_URL}/edit/${addressId}`, { userId, ...formData });
      console.log("[AddressSlice] ✅ editAddress response:", res.data);
      return res.data.address;
    } catch (err) {
      console.error("[AddressSlice] ❌ editAddress failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 4️⃣ Delete Address
export const deleteAddress = createAsyncThunk(
  "address/delete",
  async ({ userId, addressId }, { rejectWithValue }) => {
    console.log("[AddressSlice] 🔹 deleteAddress called:", { userId, addressId });
    try {
      const res = await axios.delete(`${BASE_URL}/delete/${addressId}?userId=${userId}`);
      console.log("[AddressSlice] ✅ deleteAddress response:", res.data);
      return res.data.deletedId;
    } catch (err) {
      console.error("[AddressSlice] ❌ deleteAddress failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -----------------------------
// Slice
// -----------------------------
const addressSlice = createSlice({
  name: "shopAddress",
  initialState: {
    addressList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- ADD ---
      .addCase(addNewAddresses.pending, (state) => {
        state.isLoading = true;
        console.log("[AddressSlice] addNewAddresses.pending");
      })
      .addCase(addNewAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList.unshift(action.payload);
        state.error = null;
        console.log("[AddressSlice] addNewAddresses.fulfilled -> New address added:", action.payload);
      })
      .addCase(addNewAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("[AddressSlice] addNewAddresses.rejected -> Error:", action.payload);
      })

      // --- FETCH ---
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        console.log("[AddressSlice] fetchAllAddresses.pending");
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
        state.error = null;
        console.log("[AddressSlice] fetchAllAddresses.fulfilled -> Fetched addresses:", action.payload.length);
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("[AddressSlice] fetchAllAddresses.rejected -> Error:", action.payload);
      })

      // --- EDIT ---
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        console.log("[AddressSlice] editAddress.pending");
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.addressList.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) state.addressList[index] = action.payload;
        state.error = null;
        console.log("[AddressSlice] editAddress.fulfilled -> Address updated:", action.payload);
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("[AddressSlice] editAddress.rejected -> Error:", action.payload);
      })

      // --- DELETE ---
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        console.log("[AddressSlice] deleteAddress.pending");
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.filter((a) => a._id !== action.payload);
        state.error = null;
        console.log("[AddressSlice] deleteAddress.fulfilled -> Deleted address ID:", action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("[AddressSlice] deleteAddress.rejected -> Error:", action.payload);
      });
  },
});

// -----------------------------
// Export
// -----------------------------
export default addressSlice.reducer;
