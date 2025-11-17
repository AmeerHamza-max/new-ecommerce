import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -----------------------------
// Async Thunks
// -----------------------------

// Send a new contact message
export const sendContactMessage = createAsyncThunk(
  "contact/sendMessage",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/contact", contactData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// Fetch all contact messages (admin)
export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/contact", {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// -----------------------------
// Initial State
// -----------------------------
const initialState = {
  messages: [],
  loading: false,
  error: null,
  successMessage: null,
};

// -----------------------------
// Slice
// -----------------------------
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // sendContactMessage
    builder.addCase(sendContactMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(sendContactMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(sendContactMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to send message";
    });

    // fetchContacts
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload.data || [];
    });
    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch contacts";
    });
  },
});

// -----------------------------
// Export Actions & Reducer
// -----------------------------
export const { clearSuccessMessage, clearError } = contactSlice.actions;
export default contactSlice.reducer;
