import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag, HiMiniBars3BottomRight } from 'react-icons/hi2'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

const Navbar = () => {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const [navDrawerOpen, setNavDrawerOpen] = useState(false)
   const { cart } = useSelector((state) => state.cart)
   const { user } = useSelector((state) => state.auth)

   const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

   function toggleCartDrawer() {
      setDrawerOpen(!drawerOpen)
   }
   function toggleNavDrawer() {
      setNavDrawerOpen(!navDrawerOpen)
   }
   return (
      <>
         <nav className='container mx-auto flex items-center justify-between py-4 md:px-8 px-6'>

            {/* Left */}
            <div>
               <Link to='/' className='text-2xl font-medium' >
                  Bhutta
               </Link>
            </div>
            {/* Centetr */}
            <div className='hidden md:flex space-x-6'>
               <Link to='collection/all?gender=Men' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                  Men
               </Link>
               <Link to='collection/all?gender=Women' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                  Women
               </Link>
               <Link to='collection/all?category=Top Wear' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                  Top Wear
               </Link>
               <Link to='collection/all?category=Bottom Wear' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                  Bottom Wear
               </Link>
            </div>
            {/* Right */}
            <div className="flex items-center justify-center space-x-4">
               {user && user.role === 'admin' && (
                  <Link to="/admin" className='block bg-black px-2 rounded text-md text-white'>
                     Admin
                  </Link>
               )}
               <Link to='/profile' className='hover:text-black'>
                  <HiOutlineUser className='size-6 text-gray-700' />
               </Link>
               <button onClick={toggleCartDrawer} className='relative hover:text-black cursor-pointer'>
                  <HiOutlineShoppingBag className='size-6 text-gray-700' />
                  {cartItemCount > 0 && (
                     <span className='absolute bg-red-600 text-white text-xs rounded-full -top-1 px-2 py-0.5'>
                        {cartItemCount}
                     </span>
                  )}
               </button>
               <div className="overflow-hidden">
                  <SearchBar />
               </div>
               <button onClick={toggleNavDrawer} className='md:hidden'>
                  <HiMiniBars3BottomRight className='size-6 text-gray-700' />
               </button>
            </div>

         </nav>

         <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

         {/* Mobile Navigation */}
         <div className={`fixed top-0 left-0 w-2/4 sm:w-1/2 md:1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 
         ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
         >
            <div className="flex justify-end p-4">
               <button onClick={toggleNavDrawer}>
                  <IoMdClose className='size-6 text-gray-600' />
               </button>
            </div>
            <div className="p-4">
               <h2 className='text-xl font-semibold mb-4'>Menu</h2>
               <nav className='space-y-4'>
                  <Link to='collection/all?gender=Men' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
                     Men
                  </Link>
                  <Link to='collection/all?gender=Women' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
                     Women
                  </Link>
                  <Link to='collection/all?category=Top Wear' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
                     Top Wear
                  </Link>
                  <Link to='collection/all?category=Bottom Wear' onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>
                     Bottom Wear
                  </Link>
               </nav>
            </div>
         </div>
      </>
   )
}

export default Navbar
