import React from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';


import { useEffect } from 'react';
const ProductManagement = () => {
   const dispatch = useDispatch();
   const { products, error, loading } = useSelector((state) => state.adminProducts);

   useEffect(() => {
      dispatch(fetchAdminProducts());
   }, [dispatch]);

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);


   function handleDelete(id) {
      if (window.confirm("Are you sure you want to delete this product?")) {
         try {
            dispatch(deleteProduct(id)).unwrap();
            toast.success("Product deleted successfully!");
         } catch (error) {
            toast.error("Failed to delete product");
         }
      }
   }

   if (loading) {
      return <div className='flex justify-center items-center text-xl'>Loading...</div>;
   }
   return (
      <div className='max-w-7xl mx-auto p-6'>

         <h2 className="text-2xl font-bold mb-6">Product Management</h2>

         <section className='overflow-x-auto shadow-md sm:rounded-lg'>
            <table className="min-w-full text-left text-gray-700">
               <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                     <th className="py-3 px-6">Name</th>
                     <th className="py-3 px-6">Price</th>
                     <th className="py-3 px-6">SKU</th>
                     <th className="py-3 px-6">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {
                     products.length > 0 ? (
                        products.map((product) => (
                           <tr
                              key={product._id}
                              className="border-b hover:bg-gray-50 cursor-pointer"
                           >
                              <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                                 {product.name}
                              </td>
                              <td className="px-6 py-3">
                                 {product.price}
                              </td>
                              <td className="px-6 py-3">
                                 {product.sku}
                              </td>
                              <td className="px-6 py-3">
                                 <Link
                                    to={`/admin/products/${product._id}/edit`}
                                    className='bg-yellow-500 text-white py-1.5 px-4 rounded mr-2 hover:bg-yellow-600'
                                 >
                                    Edit
                                 </Link>
                                 <button
                                    onClick={() => handleDelete(product._id)}
                                    className='bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 cursor-pointer'>
                                    Delete
                                 </button>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr className='text-center text-gray-500 text-lg'>
                           No Products found
                        </tr>
                     )
                  }
               </tbody>
            </table>
         </section>

      </div>
   )
}

export default ProductManagement
