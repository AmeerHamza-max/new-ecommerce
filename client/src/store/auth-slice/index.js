// src/store/auth-slice/auth-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ----------------------------
// Initial State
// ----------------------------
const initialState = {
  isAuthenticated: false, // User logged in hai ya nahi
  isLoading: false,     // API call chal rahi hai ya nahi
  user: null,       // User ka data: { id, email, role, username }
  error: null,       // Koi error message
};

// ----------------------------
// ASYNC THUNKS (API Calls)
// ----------------------------

// Naye User ko Register karna
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        // withCredentials: true se cookies bheji aur receive ki jaati hain
        { withCredentials: true } 
      );
      console.log("[auth/registerUser] Response Payload:", data);
      return data; // Server se mila data return karein
    } catch (error) {
      console.error("[auth/registerUser] Error:", error.response || error);
      // Error message ko extract karke reject karein
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// User ko Login karna
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
      return data;
    } catch (error) {
      console.error("[auth/loginUser] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Session Validate karna (Check Auth)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        { withCredentials: true }
      );
      console.log("[auth/checkAuth] Response Payload:", data);
      return data;
    } catch (error) {
      console.error("[auth/checkAuth] Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Auth check failed");
    }
  }
);

// User ko Logout karna
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {}, // Empty body, par POST method use ho raha hai
        { withCredentials: true }
      );
      console.log("[auth/logoutUser] Response Payload:", data);
      return data;
    } catch (error) {
      console.error("[auth/logoutUser] Error:", error.response || error);
      // Logout fail hone par bhi hum state ko reset kar sakte hain, par error message dikhana better hai
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// ----------------------------
// Slice Definition
// ----------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Manually user data set karne ke liye
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      console.log("[auth/setUser] User set:", action.payload);
    },
    // Error message hatane ke liye
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
        state.isLoading = true; // Loading shuru
        state.error = null;
        console.log("[auth/registerUser] Pending...");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/registerUser] Fulfilled, User:", state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.error = action.payload; // Error set
        state.user = null; 
        state.isAuthenticated = false;
        console.error("[auth/registerUser] Rejected:", state.error);
      })

      // ----------------------------
      // LOGIN
      // ----------------------------
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true; // Loading shuru
        state.error = null;
        console.log("[auth/loginUser] Pending...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/loginUser] Fulfilled, User:", state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.error = action.payload; // Error set
        state.user = null;
        state.isAuthenticated = false;
        console.error("[auth/loginUser] Rejected:", state.error);
      })

      // ----------------------------
      // CHECK AUTH
      // ----------------------------
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true; // Loading shuru
        state.error = null;
        console.log("[auth/checkAuth] Pending...");
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.user;
        console.log("[auth/checkAuth] Fulfilled, User:", state.user);
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.user = null; // User clear
        state.isAuthenticated = false; // Auth fail
        state.error = action.payload;
        console.error("[auth/checkAuth] Rejected:", state.error);
      })

      // ----------------------------
      // LOGOUT
      // ----------------------------
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true; // Logout ke dauran loading
        state.error = null;
        console.log("[auth/logoutUser] Pending...");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false; // Loading khatam
        state.user = null; // User clear
        state.isAuthenticated = false; // Auth fail
        state.error = null;
        console.log("[auth/logoutUser] Fulfilled, User logged out");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false; // Loading khatam
        state.error = action.payload;
        console.error("[auth/logoutUser] Rejected:", state.error);
      });
  },
});

// Reducer actions export karein (inhe 'dispatch' kiya jaata hai)
export const { setUser, clearError } = authSlice.actions;

// Default reducer export karein
export default authSlice.reducer;