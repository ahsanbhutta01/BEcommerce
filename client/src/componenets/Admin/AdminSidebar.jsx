import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {logout, logoutUser } from '../../redux/slices/authSlice'
import { clearCart } from '../../redux/slices/cartSlice'


const AdminSidebar = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   function handleLogout() {
      dispatch(logoutUser())
      dispatch(logout())
      dispatch(clearCart())
      navigate('/')
   }
   return (
      <div className='p-6'>

         <section className="mb-6">
            <Link to='/admin' className='text-2xl font-medium'>B.</Link>
         </section>

         <h2 className='text-xl font-medium mb-6 text-center'>Admin Dashboard</h2>

         <nav className='flex flex-col space-y-2'>
            <NavLink to="/admin/users" className={({ isActive }) =>
               isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 flex items-center space-x-2 rounded"}
            >
               <FaUser />
               <span>Users</span>
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) =>
               isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 flex items-center space-x-2 rounded"}
            >
               <FaBoxOpen />
               <span>Products</span>
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) =>
               isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 flex items-center space-x-2 rounded"}
            >
               <FaClipboardList />
               <span>Orders</span>
            </NavLink>
            <NavLink to="/admin/shop" className={({ isActive }) =>
               isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 flex items-center space-x-2 rounded"}
            >
               <FaStore />
               <span>Shop</span>
            </NavLink>
         </nav>

         <section className="mt-6">
            <button
               onClick={handleLogout}
               className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 cursor-pointer'
            >
               <FaSignOutAlt />
               <span>Logout</span>
            </button>
         </section>
      </div>
   )
}

export default AdminSidebar
