import React, {useState} from 'react'
import Hero from '../componenets/Layout/Hero'
import GenderCollectionSection from '../componenets/Products/GenderCollectionSection'
import NewArrivals from '../componenets/Products/NewArrivals'
import ProductDetails from '../componenets/Products/ProductDetails'
import ProductGrid from '../componenets/Products/ProductGrid'
import FeaturedCollection from '../componenets/Products/FeaturedCollection'
import FeaturedSection from '../componenets/Products/FeaturedSection'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'

const Home = () => {
   const dispatch = useDispatch()
   const { products, loading, error } = useSelector(state => state.products)
   const [bestSellerProducts, setBestSellerProducts] = useState(null)

   useEffect(() => {
      // Fetch best seller products for specific collection
      dispatch(
         fetchProductsByFilters({
            gender: "Women",
            category: "Bottom Wear",
            limit:4
         })
      );
      // Fetch best seller product
      async function fetchBestSeller() {
         try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
            
            setBestSellerProducts(response.data)
         } catch (error) {
            console.log(error)
         }
      };

      fetchBestSeller();
   }, [dispatch])

   return (
      <div>
         <Hero />
         <GenderCollectionSection />
         <NewArrivals />

         {/* Best Seller */}
         <h2 className="text-3xl text-center font-bold mb-4">
            Best Seller
         </h2>
         {bestSellerProducts
            ? (<ProductDetails productId={bestSellerProducts._id} />)
            :
            (<p className="text-center">Loading best seller products...</p>)
         }

         <div className="container mx-auto">
            <h2 className="text-3xl text-center font-bold mb-4">
               Top Wears for Women
            </h2>
            <ProductGrid products={products} loading={loading} error={error} />
         </div>
         <FeaturedCollection />
         <FeaturedSection />
      </div>
   )
}

export default Home
