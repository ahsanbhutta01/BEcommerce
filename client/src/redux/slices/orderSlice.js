import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch user orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders",
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`);
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);

      }
   }
);

// fetch order details by ID
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails",
   async (orderId, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`);
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
);

const orderSlice = createSlice({
   name: "orders",
   initialState: {
      orders: [],
      totalOrders: 0,
      orderDetails: null,
      loading: false,
      error: null
   },

   reducers: {},

   extraReducers: (builder) => {
      builder
         // Handle fetch user orders
         .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
         })
         .addCase(fetchUserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to fetch orders';
         })

         // Handle fetch order details
         .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload;
         })
         .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.msg || 'Failed to fetch orders';
         });
   }
})


export default orderSlice.reducer