import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

const initialState = {
   user: null,
   guestId: initialGuestId,
   loading: false,
   error: null
}

// check user authentication status
export const checkAuth = createAsyncThunk("auth/checkAuth",
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`);
         return response.data.user;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
)

// Async thunk for user login
export const loginUser = createAsyncThunk("auth/loginUser",
   async (userData, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);

         return response.data.user;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   })

// Async thunk for user Registration
export const registerUser = createAsyncThunk("auth/registerUser",
   async (userData, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);

         return response.data.user;
      } catch (error) {
         return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
   });

// Async thunk for user logout
export const logoutUser = createAsyncThunk("auth/logoutUser",
   async (_, { rejectWithValue }) => {
      try {
         await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`);
         return null;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   })


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logout: (state) => {
         state.user = null;
         state.guestId = `guest_${new Date().getTime()}`;// reset guestId to new time
         localStorage.setItem("guestId", state.guestId); // Update guestId in localStorage
      },
      generateNewGuestId: (state) => {
         state.guestId = `guest_${new Date().getTime()}`;
         localStorage.setItem("guestId", state.guestId); // Update guestId in localStorage
      }
   },

   extraReducers: (builder) => {
      builder.addCase(loginUser.pending, (state) => {
         state.loading = true;
         state.error = null;
      })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // CheckAuth cases 
         .addCase(checkAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(checkAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
         })
         .addCase(checkAuth.rejected, (state, action) => {
            state.loading = false;
            state.user = null; // Important: Clear user if auth check fails
            state.error = null; // Don't show error for failed auth check
         })

         // Register user cases
         .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // Logout user cases
         .addCase(logoutUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
         })
         .addCase(logoutUser.rejected, (state) => {
            state.loading = false;
            state.user = null; 
         })
   }
})

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;


