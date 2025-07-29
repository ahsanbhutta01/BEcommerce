import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '../componenets/Products/FilterSidebar';
import SortOptions from '../componenets/Products/SortOptions';
import ProductGrid from '../componenets/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';



const CollectionPage = () => {
   const {collection} = useParams();
   const [searchParam] = useSearchParams();
   const dispatch = useDispatch();
   const {products, loading, error}= useSelector((state) => state.products);
   const queryParams = Object.fromEntries([...searchParam]);

   const [isSideBarOpen, setIsSideBarOpen] = useState(false)
   const sidebarRef = useRef(null)

   useEffect(() => {
      dispatch(fetchProductsByFilters({collection, queryParams}));
   },[dispatch, collection, searchParam])

   

   function toggleSidebar() {
      setIsSideBarOpen(!isSideBarOpen)
   }
   function hanldeClickOutside(e) {
      // Close sidebar if clicked outside
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
         setIsSideBarOpen(false)
   }
   useEffect(() => {
      // Add event listner for clicks
      document.addEventListener('mousedown', hanldeClickOutside)
      return () => {
         document.addEventListener('mousedown', hanldeClickOutside)
      }
   }, [])
   return (
      <div className='flex flex-col lg:flex-row'>

         {/* Mobile Filter button */}
         <button
            className='lg:hidden border flex p-2 justify-center items-center'
            onClick={toggleSidebar}
         >
            <FaFilter className='mr-2' />
         </button>

         {/* Filter Sidebar */}
         <div
            ref={sidebarRef}
            className={`${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
         >
            <FilterSidebar />
         </div>
         <div className="flex-grow p-4">
            <h2 className="text-2xl uppercase mb-4">All Collection</h2>
            {/* Sort Options */}
            <SortOptions />
            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} error={error} />
         </div>
      </div>
   )
}

export default CollectionPage
