// src/store/auth-slice/auth-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ----------------------------
// Initial State
// ----------------------------
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,       // expects { id, email, role, username }
  error: null,
};

// ----------------------------
// ASYNC THUNKS
// ----------------------------

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      console.log("[auth/registerUser] Response Payload:", data);
      return data; // { success, message, user? }
    } catch (error) {
      console.error("[auth/registerUser] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );
      console.log("[auth/loginUser] Response Payload:", data);
      return data; // { success, message, user }
    } catch (error) {
      console.error("[auth/loginUser] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Check Auth (session validation)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        { withCredentials: true }
      );
      console.log("[auth/checkAuth] Response Payload:", data);
      return data; // { success, message, user }
    } catch (error) {
      console.error("[auth/checkAuth] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Auth check failed");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      console.log("[auth/logoutUser] Response Payload:", data);
      return data;
    } catch (error) {
      console.error("[auth/logoutUser] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// ----------------------------
// Slice
// ----------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      console.log("[auth/setUser] User set:", action.payload);
    },
    clearError: (state) => {
      state.error = null;
      console.log("[auth/clearError] Error cleared");
    },
  },
  extraReducers: (builder) => {
    builder
      // ----------------------------
      // REGISTER
      // ----------------------------
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[auth/registerUser] Pending...");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/registerUser] Fulfilled, User:", state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("[auth/registerUser] Rejected:", state.error);
      })

      // ----------------------------
      // LOGIN
      // ----------------------------
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[auth/loginUser] Pending...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/loginUser] Fulfilled, User:", state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        console.error("[auth/loginUser] Rejected:", state.error);
      })

      // ----------------------------
      // CHECK AUTH
      // ----------------------------
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("[auth/checkAuth] Pending...");
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/checkAuth] Fulfilled, User:", state.user);
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        console.error("[auth/checkAuth] Rejected:", state.error);
      })

      // ----------------------------
      // LOGOUT
      // ----------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        console.log("[auth/logoutUser] Fulfilled, User logged out");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        console.error("[auth/logoutUser] Rejected:", state.error);
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
