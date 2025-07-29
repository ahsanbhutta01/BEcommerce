import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
   'adminOrders/fetchAllOrders',
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// updating order delivery status
export const updateOrderStatus = createAsyncThunk("adminOrders/updateOrderStatus",
   async ({ id, status }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, { status });
         return response.data.updatedOrder;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);

// Delete an order
export const deleteOrder = createAsyncThunk("adminOrders/deleteOrder",
   async (id, { rejectWithValue }) => {
      try {
         await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`);
         return id;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);


const adminOrderSlice = createSlice({
   name: 'adminOrders',
   initialState: {
      orders: [],
      totalOrders: 0,
      totalSales: 0,
      loading: false,
      error: null,
   },

   reducers: {},

   extraReducers: (builder) => {
      builder
         // Fetch all orders
         .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length || 0

            // Calculate total sales
            const totalSales = action.payload.reduce((acc, order) => {
               return acc + order.totalPrice;
            }, 0);
            state.totalSales = totalSales;
         })
         .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to fetch orders';
         })

         // Update order status
         .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.orders.findIndex(order => order._id === action.payload._id);
            if (index !== -1) {
               state.orders[index] = action.payload;
            }
         })
         .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })

         // Delete order
         .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter(order => order._id !== action.payload);
         })
   }
})

export default adminOrderSlice.reducer