import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../assets/login.webp'
import { loginUser } from '../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const Login = () => {
   const [formData, setFormData] = useState({ email: '', password: '' })
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()
   const { user, guestId, error, loading } = useSelector((state) => state.auth)


   const redirect = new URLSearchParams(location.search).get('redirect') || '/';
   const isCheckoutRedirect = redirect.includes('checkout');

   useEffect(() => {
      if (error) {
         toast.error(error)
         return
      }
      if (user) {
         // Always attempt to merge cart when user logs in
         if (guestId) {
            dispatch(mergeCart({ guestId, userId: user._id })).then((result) => {
               // Clear localStorage cart after successful merge
               localStorage.removeItem('cart');
               navigate(isCheckoutRedirect ? "/checkout" : '/');
            }).catch((error) => {
               console.error('Cart merge failed:', error);
               navigate(isCheckoutRedirect ? "/checkout" : '/');
            });
         } else {
            navigate(isCheckoutRedirect ? "/checkout" : '/');
         }
      }
   }, [user, guestId, dispatch, navigate, isCheckoutRedirect, error])

   function handleFormData(e) {
      const { name, value } = e.target
      setFormData(prevData => ({ ...prevData, [name]: value }))
   }
   function handleSubmit(e) {
      e.preventDefault()
      dispatch(loginUser(formData))
   }



   return (
      <div className='flex'>
         <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
               <div className="flex justify-center mb-6">
                  <h2 className='text-xl font-medium'>Bhutta</h2>
               </div>
               <h2 className="text-2xl font-bold text-center mb-6">
                  Hey there! 👋
               </h2>
               <p className="text-center mb-6">
                  Enter your username and password to login
               </p>
               <div className="mb-4">
                  <label className='block text-sm font-semibold mb-2'>Email</label>
                  <input
                     type="email" name='email'
                     value={formData.email}
                     onChange={handleFormData}
                     className='w-full p-2 border rounded'
                     placeholder='Enter your email...'
                  />
               </div>
               <div className="mb-4">
                  <label className='block text-sm font-semibold mb-2'>Password</label>
                  <input
                     type="password" name='password'
                     value={formData.password}
                     onChange={handleFormData}
                     className='w-full p-2 border rounded'
                     placeholder='Enter your password...'
                  />
               </div>
               <button
                  type='submit'
                  disabled={loading}
                  className={`w-full p-2 rounded-lg font-semibold transition cursor-pointer ${loading
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                     }`}
               >
                  {loading ? 'Logging in...' : 'Login'}
               </button>
               <p className="mt-6 text-center text-sm">
                  Don't have an account?&nbsp;
                  <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>Register</Link>
               </p>
            </form>
         </div>

         <div className="hidden md:block w-1/2 bg-gray-800">
            <div className="h-full flex flex-col justify-center items-center">
               <img src={login} alt="" className='h-[550px] w-full object-cover' />
            </div>
         </div>
      </div>
   )
}

export default Login
