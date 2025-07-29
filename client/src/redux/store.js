import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice'; // Import the products slice
import cartReducer from './slices/cartSlice'; // Import the cart slice
import checkoutReducer from './slices/checkoutSlice'; // Import the checkout slice
import orderReducer from './slices/orderSlice'; // Import the order slice
import adminReducer from './slices/adminSlice'; // Import the admin slice
import adminProductReducer from './slices/adminProductSlice'; // Import the admin product slice
import adminOrderReducer from './slices/adminOrderSlice'; // Import the admin order slice

const store = configureStore({
   reducer: {
      auth: authReducer,
      products: productsReducer,
      orders: orderReducer,
      cart: cartReducer,
      checkout: checkoutReducer,
      admin: adminReducer,
      adminProducts: adminProductReducer,
      adminOrders: adminOrderReducer,
   }
})

export default store;