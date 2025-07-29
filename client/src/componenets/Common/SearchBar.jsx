import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice';

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   function handleSearchToggle() {
      setIsOpen(!isOpen)
   }

   function handleSearch(e){
      e.preventDefault()
      dispatch(setFilters({search: searchTerm}))
      dispatch(fetchProductsByFilters({search: searchTerm}))
      navigate(`/collection/all?search=${searchTerm}`);
      setIsOpen(false)
   }
   return (
      <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"}`}>
         {
            isOpen ? (
               <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full '>
                  <div className="relative">
                     <input
                        type="text"
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        className='bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none placeholder:text-gray-700'
                     />
                     <button
                        type='submit'
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer'

                     >
                        <HiMagnifyingGlass className='size-6' />
                     </button>
                  </div>

                  <button
                     type='button'
                     className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer'
                     onClick={handleSearchToggle}
                  >
                     <HiMiniXMark className='size-6' />
                  </button>
               </form>
            ) : (
               <button onClick={handleSearchToggle}>
                  <HiMagnifyingGlass className='size-6 cursor-pointer ml-0.8' />
               </button>
            )
         }
      </div>
   )
}

export default SearchBar
