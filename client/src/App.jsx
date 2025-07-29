import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './componenets/Layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './componenets/Products/ProductDetails'
import Checkout from './componenets/Cart/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrderPage from './pages/MyOrderPage'
import AdminLayout from './componenets/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './componenets/Admin/UserManagement'
import ProductManagement from './componenets/Admin/ProductManagement'
import EditProductPage from './componenets/Admin/EditProductPage'
import OrderManagement from './componenets/Admin/OrderManagement'

import { Provider } from 'react-redux'
import store from './redux/store'
import ProtectedRoute from './componenets/Common/ProtectedRoute'

const App = () => {



  return (
    <>
      <Provider store={store}>
        <Toaster position='top-center' />
        <BrowserRouter>

          <Routes>
            {/* User Layouts */}
            <Route path='/' element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='profile' element={<Profile />} />
              <Route path='collection/:collection' element={<CollectionPage />} />
              <Route path='product/:id' element={<ProductDetails />} />
              <Route path='checkout' element={<Checkout />} />
              <Route path='order-confirmation' element={<OrderConfirmation />} />
              <Route path='order/:id' element={<OrderDetailsPage />} />
              <Route path='my-orders' element={<MyOrderPage />} />
            </Route>

            {/*Admin Layout*/}
            <Route path='/admin' element={
              <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<AdminHomePage />} />
              <Route path='users' element={<UserManagement />} />
              <Route path='products' element={<ProductManagement />} />
              <Route path='products/:id/edit' element={<EditProductPage />} />
              <Route path='orders' element={<OrderManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
