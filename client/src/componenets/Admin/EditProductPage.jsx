import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../../redux/slices/productsSlice';
import { updateProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProductPage = () => {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { id } = useParams();
   const { selectedProduct, loading, error } = useSelector((state) => state.products);

   const [productData, setProductData] = useState({
      name: "",
      description: "",
      price: 0,
      countInStock: 0,
      sku: "",
      category: "",
      brand: "",
      sizes: [],
      colors: [],
      collections: "",
      material: "",
      gender: "",
      images: []

   });

   const [uploading, setUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   useEffect(() => {
      if (id) {
         dispatch(fetchProductById(id));
      }
   }, [id, dispatch]);

   useEffect(() => {
      if (selectedProduct) {
         setProductData(selectedProduct);
      }
   }, [selectedProduct]);

   function handleChange(e) {
      setProductData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }))
   }

   async function handleImageUpload(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
         setUploading(true);
         setUploadProgress(0);
         const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
               const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
               setUploadProgress(percentCompleted);
            }
         });

         setProductData((prevData) => ({
            ...prevData,
            images: [...prevData.images, { url: data.imageUrl, altText: data.altText }]
         }));

         setUploading(false);
         toast.success("Image uploaded successfully");
      } catch (error) {
         // console.log(error)
         toast.error("Image upload failed");
         setUploading(false);
         setUploadProgress(0);
      }
   }

   function handleSubmit(e) {
      e.preventDefault()
      dispatch(updateProduct({ id, productData }));
      navigate('/admin/products');
   }

   if (loading) {
      return <div className='flex justify-center items-center text-xl'>Loading...</div>;
   }

   if (error) {
      return <div className='flex justify-center items-center text-xl text-red-500'>{error}</div>;
   }
   if (!selectedProduct) {
      return <div className='flex justify-center items-center text-xl'>Product not found</div>;
   }
   return (
      <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>

         <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

         <form onSubmit={handleSubmit}>
            <div className="mb-6">
               <label className='block font-semibold mb-2'>Product Name</label>
               <input
                  type="text"
                  name='name'
                  value={productData.name}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-md p-2'
                  required
               />
            </div>
            <div className="mb-6">
               <label className='block font-semibold mb-2'>Description</label>
               <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-md p-2'
                  rows={4}
                  required
               />
            </div>
            <div className="mb-6">
               <label className="block font-semibold mb-2">Price</label>
               <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-md p-2'
               />
            </div>
            <div className="mb-6">
               <label className="block font-semibold mb-2">Count In Stock</label>
               <input
                  type="number"
                  name="countInStock"
                  value={productData.countInStock}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-md p-2'
               />
            </div>
            <div className="mb-6">
               <label className="block font-semibold mb-2">SKU</label>
               <input
                  type="text"
                  name="sku"
                  value={productData.sku}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-md p-2'
               />
            </div>
            <div className="mb-6">
               <label className="block font-semibold mb-2">Sizes (comma separated)</label>
               <input
                  type="text"
                  name="sizes"
                  value={productData.sizes.join(',')}
                  onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((size) => size.trim()) })}
                  className='w-full border border-gray-300 rounded-md p-2'
               />
            </div>
            <div className="mb-6">
               <label className="block font-semibold mb-2">Colors (comma separated)</label>
               <input
                  type="text"
                  name="colors"
                  value={productData.colors.join(',')}
                  onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(',').map((color) => color.trim()) })}
                  className='w-full border border-gray-300 rounded-md p-2'
               />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
               <label className="block font-semibold mb-2">Upload Image</label>
               <input type="file"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  accept='image/*'

               />

               {uploading && (
                  <div className='mt-3'>
                     <div className='flex items-center mb-2'>
                        <span className='text-blue-600 font-medium'>Image uploading...</span>
                        <span className='ml-2 text-blue-600 font-bold'>{uploadProgress}%</span>
                     </div>
                     <div className='w-full bg-gray-200 rounded-full h-3'>
                        <div
                           className='bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out'
                           style={{ width: `${uploadProgress}%` }}
                        ></div>
                     </div>
                  </div>
               )}
               <div className="flex gap-4 mt-4">
                  {
                     productData.images.map((img, i) => (
                        <div key={i}>
                           <img
                              src={img.url}
                              alt={img.altText || "Product Image"}
                              className='size-20 object-cover rounded-md shadow-m'
                           />
                        </div>
                     ))
                  }
               </div>
            </div>
            <button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-400 cursor-pointer'>
               Update Product
            </button>
         </form>
      </div>
   )
}

export default EditProductPage
