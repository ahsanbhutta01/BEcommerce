import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createCheckout } from '../../redux/slices/checkoutSlice'
import axios from 'axios'

const Checkout = () => {
   const [checkoutId, setCheckoutId] = useState(null)
   const [paymentSuccess, setPaymentSuccess] = useState(false);
   const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
   const [isProcessingPayment, setIsProcessingPayment] = useState(false);

   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { cart, loading, error } = useSelector((state) => state.cart)
   const { user } = useSelector((state) => state.auth)

   const [shippingAddress, setShippingAddress] = useState({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: ""
   })

   useEffect(() => {
      if (!cart || !cart.products || cart.products.length === 0) {
         navigate('/')
      }
   }, [cart, navigate])

   // Fix: Make this async and await the dispatch
   async function handleCreateCheckout(e) {
      e.preventDefault()

      // Prevent multiple submissions
      if (checkoutId) return;

      if (cart && cart.products.length > 0) {
         try {
            const result = await dispatch(createCheckout({
               checkoutItems: cart.products,
               shippingAddress,
               paymentMethod: "Paypal",
               totalPrice: cart.totalPrice
            }));

            if (result.payload && result.payload._id) {
               setCheckoutId(result.payload._id);
            }
         } catch (error) {
            console.error('Checkout creation failed:', error);
         }
      }
   }

   // Fix: Add mock payment simulation
   async function handlePayment() {
      setIsProcessingPayment(true);

      // Simulate payment processing
      setTimeout(async () => {
         try {
            // 🔥 CHANGE THIS TO false TO SIMULATE PAYMENT FAILURE 🔥
            const isSuccess = true;

            if (isSuccess) {
               // Create mock payment details
               const mockPaymentDetails = {
                  transactionId: 'MOCK_TXN_' + Date.now(),
                  paymentMethod: 'Mock PayPal',
                  amount: cart.totalPrice,
                  currency: 'USD',
                  status: 'completed',
                  paidAt: new Date().toISOString(),
                  mock: true // Indicates this is a mock payment
               };

               const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, {
                  paymentStatus: "paid",
                  paymentDetails: mockPaymentDetails
               });


               setPaymentSuccess(true);
               toast.success('Payment Successful!');
               await handleFinalizeCheckout(checkoutId);

            }
         } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment processing failed. Please try again.');
         }

         setIsProcessingPayment(false);
      }, 2000); // 2 second delay to simulate real payment processing
   }

   async function handleFinalizeCheckout(checkoutId) {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {});

         toast.success('Order confirmed!');
         navigate('/order-confirmation');

      }
      catch (error) {
         console.error('Finalize error:', error);
         toast.error('Failed to finalize order');
      }
   }

   if (loading) return <div className="flex justify-center items-center min-h-screen"><p>Loading cart...</p></div>
   if (error) return <div className="flex justify-center items-center min-h-screen"><p className='text-red-500'>{error}</p></div>
   if (!cart || !cart.products || cart.products.length === 0) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
               <p className="mb-4">Your cart is empty</p>
               <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded">
                  Continue Shopping
               </button>
            </div>
         </div>
      )
   }

   return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
         {/* Left Section */}
         <aside className="bg-white rounded-lg p-6">
            <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
            <form onSubmit={handleCreateCheckout}>
               <h3 className='text-lg mb-4'>Contact Details</h3>
               <section className="mb-4">
                  <label className='block text-gray-700'>Email</label>
                  <input
                     type="email"
                     value={user?.email || ""}
                     className='w-full p-2 border rounded bg-gray-200'
                     disabled
                  />
               </section>

               <h3 className='text-lg mb-4'>Delivery</h3>
               <section className='mb-4 grid grid-cols-2 gap-4'>
                  <div>
                     <label className='block text-gray-700'>First Name</label>
                     <input
                        type="text"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className='w-full p-2 border rounded'
                        required
                        disabled={checkoutId} // Disable after checkout is created
                     />
                  </div>
                  <div>
                     <label className='block text-gray-700'>Last Name</label>
                     <input
                        type="text"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className='w-full p-2 border rounded'
                        required
                        disabled={checkoutId}
                     />
                  </div>
               </section>

               <section className='mb-4'>
                  <label className='block text-gray-700'>Address</label>
                  <input
                     type="text"
                     value={shippingAddress.address}
                     onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                     className='w-full p-2 border rounded'
                     required
                     disabled={checkoutId}
                  />
               </section>

               <section className='mb-4 grid grid-cols-2 gap-4'>
                  <div>
                     <label className='block text-gray-700'>City</label>
                     <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className='w-full p-2 border rounded'
                        required
                        disabled={checkoutId}
                     />
                  </div>
                  <div>
                     <label className='block text-gray-700'>Postal Code</label>
                     <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className='w-full p-2 border rounded'
                        required
                        disabled={checkoutId}
                     />
                  </div>
               </section>

               <section className='mb-4'>
                  <label className='block text-gray-700'>Country</label>
                  <input
                     type="text"
                     value={shippingAddress.country}
                     onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                     className='w-full p-2 border rounded'
                     required
                     disabled={checkoutId}
                  />
               </section>

               <section className='mb-4'>
                  <label className='block text-gray-700'>Phone</label>
                  <input
                     type="tel"
                     value={shippingAddress.phone}
                     onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                     className='w-full p-2 border rounded'
                     required
                     disabled={checkoutId}
                  />
               </section>

               <section className='mt-8'>
                  {!checkoutId ? (
                     <button
                        type='submit'
                        className='w-full bg-black text-white py-3 rounded cursor-pointer hover:bg-gray-800 transition disabled:opacity-50'
                        disabled={isCreatingCheckout}
                     >
                        {isCreatingCheckout ? 'Creating Checkout...' : 'Continue to Payment'}
                     </button>
                  ) : (
                     <div>
                        {!paymentSuccess ? (
                           <>
                              <h3 className='text-lg mb-4'>Mock PayPal Payment</h3>
                              <button
                                 onClick={handlePayment}
                                 className='w-full bg-[#0070ba] text-white py-3 rounded cursor-pointer hover:bg-[#005ea6] transition disabled:opacity-50'
                                 disabled={isProcessingPayment}
                              >
                                 {isProcessingPayment ? (
                                    <div className="flex items-center justify-center">
                                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                       Processing Payment...
                                    </div>
                                 ) : (
                                    <>
                                       <span className='text-white font-bold text-xl'>Pay</span>
                                       <span className='text-[#ffcc02] font-extrabold text-xl'>Pal</span>
                                    </>
                                 )}
                              </button>
                           </>
                        ) : (
                           <div className="text-center">
                              <div className="text-green-600 text-lg font-semibold mb-2">
                                 ✅ Payment Successful!
                              </div>
                              <p className="text-gray-600">Processing your order...</p>
                           </div>
                        )}
                     </div>
                  )}
               </section>
            </form>
         </aside>

         {/* Right Side */}
         <aside className='bg-gray-50 p-5 rounded-lg'>
            <h3 className='text-lg mb-4'>Order Summary</h3>
            <section className='border-t py-3 mb-4'>
               {cart.products.map((product, index) => (
                  <div key={index} className='flex justify-between items-start py-2 border-b'>
                     <div className='flex items-start'>
                        <img
                           src={product.image}
                           alt={product.name}
                           className='size-24 object-cover mr-4 rounded'
                        />
                        <div>
                           <h3 className='text-md font-medium'>{product.name}</h3>
                           <p className="text-gray-500 text-sm">Size: {product.size}</p>
                           <p className='text-gray-500 text-sm'>Color: {product.color}</p>
                           <p className='text-gray-500 text-sm'>Qty: {product.quantity}</p>
                        </div>
                     </div>
                     <p className="text-lg font-medium">${(product.price * product.quantity)?.toLocaleString()}</p>
                  </div>
               ))}
            </section>

            <section className="flex justify-between items-center text-lg mb-4">
               <p>Subtotal</p>
               <p>${cart.totalPrice?.toLocaleString()}</p>
            </section>

            <section className="flex justify-between items-center text-lg">
               <p>Shipping</p>
               <p className="text-green-600">Free</p>
            </section>

            <section className='flex justify-between items-center text-xl font-semibold mt-4 border-t pt-4'>
               <p>Total</p>
               <p>${cart.totalPrice?.toLocaleString()}</p>
            </section>
         </aside>
      </div>
   )
}

export default Checkout