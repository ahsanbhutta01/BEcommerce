import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice'

const CartContent = ({ cart, userId, guestId }) => {
   const dispatch = useDispatch()

   function handleAddToCart(productId, delta, quantity, size, color) {
      const newQuantity = quantity + delta
      if (newQuantity >= 1) {
         dispatch(updateCartItemQuantity({
            productId,
            quantity: newQuantity,
            guestId,
            userId,
            size,
            color
         }))
      }
   }

   function handleRemoveFromCart(productId, size, color) {
      dispatch(removeFromCart({
         productId,
         guestId,
         userId,
         size,
         color
      }))
   }

   return (
      <div>
         {
            cart.products.map((product, index) => (
               <div key={index} className="flex items-start justify-between py-4 border-b">
                  <div className='flex items-start'>
                     <img
                        src={product.image}
                        alt={product.name}
                        className='size-20 object-cover mr-4 rounded-b-md'
                     />
                     <div>
                        <h3>{product.name}</h3>
                        <p>
                           size: {product.size} | color: {product.color}
                        </p>
                        <div className='flex items-center mt-2'>
                           <button className='border rounded px-2 py-0.2 text-xl font-medium cursor-pointer' onClick={()=>handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}>
                              -
                           </button>
                           <span className='mx-4'>{product.quantity}</span>
                           <button className='border rounded px-2 py-0.2 text-xl font-medium cursor-pointer' onClick={()=>handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}>
                              +
                           </button>
                        </div>
                     </div>
                  </div>
                  <div>
                     <p>$ {product.price.toLocaleString()}</p>
                     <button onClick={()=> handleRemoveFromCart(product.productId, product.size, product.color)} className='text-red-600 hover:text-red-800'>
                     <RiDeleteBin3Line className='size-6 mt-2 text-red-700 cursor-pointer' />
                     </button>
                  </div>
               </div>
            ))
         }
      </div>
   )
}

export default CartContent
