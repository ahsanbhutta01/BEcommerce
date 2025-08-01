import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'


const categories = ["Top Wear", "Bottom Wear"];
const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beech Breeze", "Fashionista", "ChicStyle"];
const genders = ["Men", "Women"]

const FilterSidebar = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const [filters, setFilters] = useState({
      category: '',
      gender: '',
      color: '',
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 100
   })
   const [priceRange, setPriceRange] = useState([0, 100]);
   useEffect(() => {
      const params = Object.fromEntries([...searchParams])
      // we get from url params like {category:'Top Wear', maxPrice:'100' }=>params.category
      setFilters({
         category: params.category || "",
         gender: params.gender || "",
         color: params.color || "",
         size: params.size ? params.size.split(",") : [],
         material: params.material ? params.material.split(",") : [],
         brand: params.brand ? params.brand.split(",") : [],
         minPrice: params.minPrice || 0,
         maxPrice: params.maxPrice || 100,
      });
      setPriceRange([0, params.maxPrice || 100])
   }, [])

   function handleFilterChange(e) {
      const { name, value, checked, type } = e.target
      let newFilters = { ...filters }

      if (type === "checkbox") {
         if (checked) {
            newFilters[name] = [...(newFilters[name] || []), value]
         } else {
            newFilters[name] = newFilters[name].filter((item) => item !== value)
         }
      } else {
         newFilters[name] = value
      }
      setFilters(newFilters)
      // console.log(newFilters)
      updateURLParams(newFilters)

   }

   function updateURLParams(newFilters) {
      const params = new URLSearchParams();
      Object.keys(newFilters).forEach((key) => {
         if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
            params.append(key, newFilters[key].join(","))
         } else if (newFilters[key]) {
            params.append(key, newFilters[key])
         }
      });
      setSearchParams(params);
      navigate(`?${params.toString()}`)
      //?size=xs%2CS%2CXXL&brand=Urban+Thread (%2C mean comma and + means space b/w urban and thread)
   }

   function handlePriceChange(e){
      const newPrice = e.target.value;
      setPriceRange([0, newPrice]);
      const newFilters = {...filters, minPrice:0, maxPrice:newPrice}
      setFilters(filters)
      updateURLParams(newFilters)
   }

   return (
      <div className='p-4'>
         <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

         {/* Category Filter */}
         <div className="mb-6">
            <label className='block text-gray-600 font-medium mb-2'>Category</label>
            {
               categories.map((category, index) => (
                  <div key={index} className='flex items-center mb-1'>
                     <input
                        type="radio"
                        name='category'
                        className='mr-2 size-5 cursor-pointer text-blue-500 focus:ring-blue-400 border-gray-300 accent-blue-600'
                        value={category}
                        onChange={handleFilterChange}
                        checked={filters.category === category}
                     />
                     <span className='text-gray-700 '>{category} </span>
                  </div>
               ))
            }
         </div>
         {/* Gender Filter */}
         <div className="mb-6">
            <label className='block text-gray-600 font-medium mb-2'>Category</label>
            {
               genders.map((gender, index) => (
                  <div key={index} className='flex items-center mb-1'>
                     <input
                        type="radio"
                        name='gender'
                        value={gender}
                        onChange={handleFilterChange}
                        className='mr-2 size-5 cursor-pointer text-blue-500 focus:ring-blue-400 border-gray-300 accent-blue-600'
                        checked={filters.gender === gender}
                     />
                     <span className='text-gray-700'>{gender} </span>
                  </div>
               ))
            }
         </div>
         {/* Color Filter */}
         <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Color</label>
            <div className="flex flex-wrap">
               {
                  colors.map((color, index) => (
                     <button
                        key={index}
                        name='color'
                        value={color}
                        onChange={handleFilterChange}
                        className={`size-8 rounded-full border border-gray-400 cursor-pointer transition hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500": ""}`}
                        style={{ backgroundColor: color.toLocaleLowerCase() }}
                     >
                     </button>
                  ))
               }
            </div>
         </div>
         {/* Size Filter */}
         <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Size</label>
            {
               sizes.map((size, index) => (
                  <div key={index} className='flex items-center mb-1'>
                     <input
                        type="checkbox"
                        name='size'
                        value={size}
                        onChange={handleFilterChange}
                        className='mr-2 size-5 text-blue-300 cursor-pointer focus:ring-blue-400 border-gray-300 accent-blue-600'
                        checked={filters.size.includes(size)}
                     />
                     <label className='text-gray-700'>{size}</label>
                  </div>
               ))
            }
         </div>
         {/* Material Filter */}
         <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Material</label>
            {
               materials.map((material, index) => (
                  <div key={index} className='flex items-center mb-1'>
                     <input
                        type="checkbox"
                        name='material'
                        value={material}
                        onChange={handleFilterChange}
                        className='mr-2 size-5 text-blue-300 cursor-pointer focus:ring-blue-400 border-gray-300 accent-blue-600'
                        checked={filters.material.includes(material)}
                        
                     />
                     <span className='text-gray-700'>{material}</span>
                  </div>
               ))
            }
         </div>
         {/* Brand Filter */}
         <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Brand</label>
            {
               brands.map((brand, index) => (
                  <div key={index} className='flex items-center mb-1'>
                     <input
                        type="checkbox"
                        name='brand'
                        value={brand}
                        onChange={handleFilterChange}
                        className='mr-2 size-5 text-blue-700 cursor-pointer focus:ring-blue-400 border-gray-300 accent-blue-600 '
                        checked={filters.brand.includes(brand)}
                     />
                     <span className='text-gray-700'>{brand}</span>
                  </div>
               ))
            }
         </div>
         {/* Price Range Filter */}
         <div className="mb-6">
            <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
            <input
               type="range"
               name='priceRange'
               min={0}
               max={100}
               value={priceRange[1]}
               onChange={handlePriceChange}
               className='w-full h-2 accent-blue-600 bg-gray-300 rounded-lg appearance-none cursor-pointer'
            />
            <div className="flex justify-between text-gray-600 mt-2">
               <span>$0</span>
               <span>${priceRange[1]}</span>
            </div>
         </div>
      </div>
   )
}

export default FilterSidebar
