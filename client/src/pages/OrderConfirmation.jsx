import React, { useEffect } from 'react'
import {useDispatch, useSelector, } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'


const OrderConfirmation = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const {checkout} = useSelector((state) => state.checkout)

   useEffect(()=>{
      if(checkout && checkout._id) {
         dispatch(clearCart())
         localStorage.removeItem('cart')
         return
      }else{
         navigate('/my-orders')
      }
   },[checkout, dispatch,navigate])

   function calculteEstimatedDelivery(createdAt) {
      const orderDate = new Date(createdAt);
      orderDate.setDate(orderDate.getDate() + 10)//Add 10 days to the order date
      return orderDate.toLocaleDateString()
   }
   return (
      <div className='max-w-4xl mx-auto p-6 bg-white'>
         <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
            Thank You For Your Order
         </h1>
         {
            checkout && (
               <div className='p-6 rounded-lg border'>
                  <div className="flex justify-between mb-20">
                     {/* Order ID amd Date */}
                     <div>
                        <h2 className='text-xl font-semibold'>
                           Order ID: {checkout._id}
                        </h2>
                        <p className="textgray-500">
                           Oder Date: {new Date(checkout.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                     {/* Estimated Delivery */}
                     <div>
                        <p className="text-sm text-emerald-700">
                           Estimated Delivery: {calculteEstimatedDelivery(checkout.createdAt)}
                        </p>
                     </div>
                  </div>
                  {/* Ordered Items */}
                  <div className="mb-20">
                     {
                        checkout.checkoutItems.map((item) => (
                           <div key={item.productId} className='flex items-center mb-4'>
                              <img
                                 src={item.image}
                                 alt={item.name}
                                 className='size-16 object-cover rounded-md mr-4'
                              />
                              <div>
                                 <h4 className="text-md font-semibold">{item.name}</h4>
                                 <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
                              </div>
                              <div className="ml-auto text-right">
                                 <p className="text-md">${item.price}</p>
                                 <p className="text-sm">Oty: {item.quantity}</p>
                              </div>
                           </div>
                        ))
                     }
                  </div>
                  {/* Payment and Delivery Info */}
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h4 className="text-lg font-semibold mb-2">Payment</h4>
                        <p className="text-gray-600">PayPal</p>
                     </div>
                     {/* Delivery Info */}
                     <div>
                        <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                        <p className="text-gray-600">
                           {checkout.shippingAddress.address}
                        </p>
                        <p className="text-gray-600">
                           {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
                        </p>
                     </div>
                  </div>
               </div>
            )
         }
      </div>
   )
}

export default OrderConfirmation
