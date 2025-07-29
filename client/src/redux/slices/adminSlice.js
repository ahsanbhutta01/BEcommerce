import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// fetch all users
export const fetchUsers = createAsyncThunk('admin/fetchUsers',
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Add the create user action
export const addUser = createAsyncThunk('admin/addUser',
   async (userData, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData);
         return response.data.newUser;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Update user details
export const updateUser = createAsyncThunk('admin/updateUser',
   async ({ id, name, email, role }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, { name, email, role });
         return response.data.updatedUser;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Delete user
export const deleteUser = createAsyncThunk('admin/deleteUser',
   async (id, { rejectWithValue }) => {
      try {
         await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`);
         return id;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

const adminSlice = createSlice({
   name: 'admin',
   initialState: {
      users: [],
      loading: false,
      error: null,
   },

   reducers: {},

   extraReducers: (builder) => {
      builder
         // Handle fetch users
         .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to fetch users';
         })

         // Handle update user
         .addCase(updateUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            const updateUser = action.payload;
            const userIndex = state.users.findIndex(user => user._id === updateUser._id);
            if (userIndex !== -1) {
               state.users[userIndex] = updateUser;
            }
         })
         .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to update user';
         })

         // Handle delete user
         .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.filter(user => user._id !== action.payload);
         })
         .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to delete user';
         })

         // Handle add user
         .addCase(addUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
         })
         .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to add user';
         })
   }
})


export default adminSlice.reducer