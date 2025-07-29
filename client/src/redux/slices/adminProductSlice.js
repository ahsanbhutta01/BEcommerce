import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch admin products
export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchProducts',
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Create new product
export const createProduct = createAsyncThunk('adminProducts/createProduct',
   async (productData, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, productData);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Update existing product
export const updateProduct = createAsyncThunk('adminProducts/updateProduct',
   async ({ id, productData }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Delete product
export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct',
   async (id, { rejectWithValue }) => {
      try {
         await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
         return id;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);


const adminProductSlice = createSlice({
   name: 'adminProducts',
   initialState: {
      products: [],
      loading: false,
      error: null,
   },

   reducers: {},

   extraReducers: (builder) => {
      builder
         // Fetch admin products
         .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
         })
         .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to fetch products';
         })

         // create new product
         .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
         })
         .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to create product';
         })

         // Update existing product
         .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.products.findIndex((product) => product._id === action.payload._id);
            if (index !== -1) {
               state.products[index] = action.payload;
            }
         })
         .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to update product';
         })

         // Delete product
         .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter((product) => product._id !== action.payload);
         })
   }
})

export default adminProductSlice.reducer