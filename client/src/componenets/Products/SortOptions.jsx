import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
   const [searchParams, setSearchParams] = useSearchParams()

   function handleSortChange(e){
      const sortBy = e.target.value;
      searchParams.set("sortBy", sortBy)
      setSearchParams(searchParams)

   }
   return (
      <div className='mb-4 flex items-center justify-end'>
         <select
            id="sort"
            className='border p-2 rounded-md focus:outline-none'
            onChange={handleSortChange}
            value={searchParams.get("sortBy") || ""}
         >
            <option>Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
         </select>
      </div>
   )
}

export default SortOptions
