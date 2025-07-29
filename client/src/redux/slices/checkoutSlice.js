import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const createCheckout = createAsyncThunk('checkout/createCheckout',
   async(checkoutSata, {rejectWithValue})=>{
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutSata);
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
)


const checkoutSlice = createSlice({
   name:"checkout",
   initialState:{
      checkout:null,
      loading:false,
      error:null
   },

   reducers:{},

   extraReducers:(builder)=>{
      builder
      .addCase(createCheckout.pending, (state)=>{
         state.loading = true;
         state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
         state.loading = false;
         state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload?.msg || 'Failed to create checkout';
      });
   }
})


export default checkoutSlice.reducer;