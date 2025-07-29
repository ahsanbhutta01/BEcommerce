import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

function loadCartFromStorage() {
   const storedCart = localStorage.getItem('cart');
   return storedCart ? JSON.parse(storedCart) : ({ products: [] })
};

function saveCartToStorage(cart) {
   localStorage.setItem('cart', JSON.stringify(cart));
}

//Fetch cart for user or guest
export const fetchCart = createAsyncThunk('cart/fetchCart',
   async ({ userId, guestId }, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
               params: { userId, guestId }
            }

         );
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
);

// Add an item to cart for user or guest
export const addToCart = createAsyncThunk('cart/addToCart',
   async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            size,
            color,
            guestId,
            userId
         });
         return response.data.cart;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItem',
   async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
      try {
         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            guestId,
            userId,
            size,
            color
         });
         return response.data.cart;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart',
   async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
      try {
         const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            data: { productId, guestId, userId, size, color }
         });
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);
      }
   }
);

// Merge guest cart with user cart
export const mergeCart = createAsyncThunk('cart/mergeCart',
   async ({ guestId, userId }, { rejectWithValue }) => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, {
            guestId,
            userId
         });
         return response.data;
      } catch (error) {
         console.log(error);
         return rejectWithValue(error.response.data);

      }
   }
);


const cartSlice = createSlice({
   name: "cart",
   initialState: {
      cart: loadCartFromStorage(),
      loading: false,
      error: null
   },

   reducers: {
      clearCart: (state) => {
         state.cart = { products: [] };
         localStorage.removeItem('cart');
      }
   },

   extraReducers: (builder) => {
      builder
         .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(state.cart);
         })
         .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch cart';
         })

         // Handle addToCart
         .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(state.cart);
         })
         .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to add the cart';
         })

         // Handle updateCartItemQuantity
         .addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(state.cart);
         })
         .addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to update cart item quantity';
         })

         // Handle removeFromCart
         .addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToStorage(state.cart);
         })
         .addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to remove item from cart';
         })

         // Handle mergeCart
         .addCase(mergeCart.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(mergeCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload.cart || action.payload;
            saveCartToStorage(state.cart);
         })
         .addCase(mergeCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to merge cart';
         })

   }
})


export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

