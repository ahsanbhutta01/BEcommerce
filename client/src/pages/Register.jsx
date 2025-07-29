import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import register from '../assets/register.webp'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice.js'
import toast from 'react-hot-toast'


const Register = () => {
   const [formData, setFormData] = useState({ name: '', email: '', password: '' })
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()
   const { user, guestId, error, loading } = useSelector((state) => state.auth)
   const { cart } = useSelector((state) => state.cart)

   const redirect = new URLSearchParams(location.search).get('redirect') || '/';
   const isCheckoutRedirect = redirect.includes('checkout');

   useEffect(() => {
      if (user) {
         if (cart?.products?.length > 0 && guestId) {
            dispatch(mergeCart({ guestId, userId: user._id })).then(() => {
               navigate(isCheckoutRedirect ? "/checkout" : '/')
            })
         } else {
            navigate(isCheckoutRedirect ? "/checkout" : '/')
         }
      }
   }, [user, cart, guestId, dispatch, navigate, isCheckoutRedirect])

   function handleFormData(e) {
      const { name, value } = e.target
      setFormData(prevData => ({ ...prevData, [name]: value }))
   }
   function handleSubmit(e) {
      e.preventDefault()
      dispatch(registerUser(formData)).unwrap().
         then(() => {
            toast.success('Registration successful!')
            // Reset form after successful registration
            setFormData({ name: '', email: '', password: '' })
            navigate('/')
         }).catch(() => {
            toast.error(error)
         })

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
                  <label className='block text-sm font-semibold mb-2'>Name</label>
                  <input
                     type="text" name='name'
                     value={formData.name}
                     onChange={handleFormData}
                     className='w-full p-2 border rounded'
                     placeholder='Enter your name...'
                  />
               </div>
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
                  {loading ? 'Signing Up...' : 'Sign Up'}
               </button>
               <p className="mt-6 text-center text-sm">
                  Already have an account?&nbsp;
                  <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>Login</Link>
               </p>
            </form>
         </div>

         <div className="hidden md:block w-1/2 bg-gray-800">
            <div className="h-full flex flex-col justify-center items-center">
               <img src={register} alt="" className='h-[550px] w-full object-cover' />
            </div>
         </div>
      </div>
   )
}

export default Register
