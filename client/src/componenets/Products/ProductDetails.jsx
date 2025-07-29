import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ProductGrid from './ProductGrid'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, fetchSimilarProducts } from '../../redux/slices/productsSlice'
import { addToCart } from '../../redux/slices/cartSlice'


const ProductDetails = ({ productId }) => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const { selectedProduct, similarProducts, loading, error } = useSelector(state => state.products)
   const { user, guestId } = useSelector(state => state.auth)

   const [mainImage, setMainImage] = useState("")
   const [selectedSize, setSelectedSize] = useState("")
   const [selectedColor, setSelectedColor] = useState("")
   const [quantity, setQuantity] = useState(1);
   const [isButtonDisabled, setIsButtonDisabled] = useState(false)

   const productFetchId = productId || id
   useEffect(() => {

      if (productFetchId) {

         dispatch(fetchProductById(productFetchId))
         dispatch(fetchSimilarProducts({ id: productFetchId }))
      }
   }, [dispatch, productFetchId])

   useEffect(() => {
      if (selectedProduct?.images?.length > 0) {
         setMainImage(selectedProduct.images[0].url)
      }
   }, [selectedProduct])

   function handleQuantityChange(action) {
      if (action === "plus") setQuantity(prev => prev + 1)
      if (action === "minus" && quantity > 1) setQuantity(prev => prev - 1)
   }

   function handleAddToCart() {
      if (!selectedSize || !selectedColor) {
         toast.error("Please select a size and color before"
         )
         return;
      }
      if (isButtonDisabled) return;
      setIsButtonDisabled(true)
      dispatch(
         addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id
         })
      ).then(() => {
         toast.success("Product added to cart successfully")
      }).finally(() => {
         setIsButtonDisabled(false)
      })
   }


   if (loading) return <p>Loading...</p>
   if (error) return <p className="text-center text-red-500">Error: {error}</p>
   return (
      <div className='p-6 '>
         {selectedProduct && (
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
               <div className="flex flex-col md:flex-row">
                  {/* Left Thumbnails */}
                  <div className="hidden md:flex flex-col space-y-4 mr-6">
                     {
                        selectedProduct.images?.map((img, index) => (
                           <img
                              key={index}
                              src={img.url}
                              alt={img.altText || `Thumbnail ${index}`}
                              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === img.url ? "border-black" : "border-gray-300"}`}
                              onClick={() => setMainImage(img.url)}
                           />
                        ))
                     }
                  </div>
                  {/* Main Image */}
                  <div className="md:w-1/2">
                     <div className="mb-4">
                        <img
                           src={mainImage} alt="Main Product"
                           className='w-full h-auto object-cover rounded-lg'
                        />

                     </div>
                  </div>
                  {/* Mobile Thumbnail */}
                  <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                     {
                        selectedProduct.images?.map((img, index) => (
                           <img
                              key={index}
                              src={img.url}
                              alt={img.altText || `Thumbnail ${index}`}
                              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === img.url ? "border-black" : "border-gray-300"}`}
                              onClick={() => setMainImage(img.url)}
                           />
                        ))
                     }
                  </div>
                  {/* Right Side */}
                  <div className='md:w-1/2 md:ml-10'>
                     <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                        {selectedProduct.name}
                     </h1>
                     <p className="text-lg text-gray-600 mb-1 line-through">
                        {selectedProduct.originalPrice && `${selectedProduct.originalPrice}`}
                     </p>
                     <p className="text-xl text-gray-600 mb-2">
                        $ {selectedProduct.price}
                     </p>
                     <p className="text-gray-600 mb-4">
                        {selectedProduct.description}
                     </p>
                     <div className="mb-4">
                        <p className="text-gray-700">Color:</p>
                        <div className="flex gap-2 mt-2">
                           {
                              selectedProduct.colors?.map((color) => (
                                 <button
                                    key={color}
                                    className={`size-8 rounded-full border cursor-pointer ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                       backgroundColor: color.toLocaleLowerCase(),
                                       filter: "brightness(0.5)"
                                    }}
                                 >

                                 </button>
                              ))}
                        </div>
                     </div>

                     <div className="mb-4">
                        <p className="text-gray-700">Size:</p>
                        <div className="flex gap-2 mt-2">
                           {
                              selectedProduct.sizes?.map((size) => (
                                 <button
                                    key={size}
                                    className={`px-4 py-2 rounded border cursor-pointer ${selectedSize === size ? "bg-black text-white" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                 >
                                    {size}
                                 </button>
                              ))}
                        </div>
                     </div>

                     <div className="mb-6">
                        <p className="text-gray-700">Quantity:</p>
                        <div className="flex items-center  space-x-4 mt-2">
                           <button
                              className='px-3 py-0.8 bg-gray-200 rounded text-lg cursor-pointer'
                              onClick={() => handleQuantityChange("minus")}
                           >
                              -
                           </button>
                           <span className='text-lg'>{quantity}</span>
                           <button
                              className='px-3 py-0.8 bg-gray-200 rounded text-lg cursor-pointer'
                              onClick={() => handleQuantityChange("plus")}
                           >
                              +
                           </button>
                        </div>
                     </div>
                     <button
                        onClick={handleAddToCart}
                        disabled={isButtonDisabled}
                        className={`bg-black text-white py-2 px-6 rounded w-full mb-4 cursor-pointer ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : "hover:bg-gray-900"}`}

                     >
                        {isButtonDisabled ? "Adding..." : "Add To Cart"}
                     </button>
                     <div className="mt-10 text-gray-700">
                        <h3 className='text-xl font-bold mb-4'>Characteristics:</h3>
                        <table className='w-full text-left text-sm text-gray-600'>
                           <tbody>
                              <tr>
                                 <td className='py-1'>Brand</td>
                                 <td className="py1">{selectedProduct.brand}</td>
                              </tr>
                              <tr>
                                 <td className='py-1'>Material</td>
                                 <td className="py1">{selectedProduct.material}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               <div className="mt-20">
                  <h2 className="text-2xl text-center font-medium mb-4">
                     You May Also Like
                  </h2>
                  <ProductGrid products={similarProducts} />
               </div>
            </div>
         )}

      </div>
   )
}

export default ProductDetails
