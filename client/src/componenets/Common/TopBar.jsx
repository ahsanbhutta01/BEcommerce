import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const TopBar = () => {
   return (
      <div className='bg-b-red text-white'>
         <div className="container mx-auto flex justify-between items-center py-3 px-4 ">

            <div className='hidden md:flex items-center space-x-4'>
               <a href="#" className='hover:text-gray-300'>
                  <TbBrandMeta className='size-6' />
               </a>
               <a href="#" className='hover:text-gray-300'>
                  <IoLogoInstagram className='size-6' />
               </a>
               <a href="#" className='hover:text-gray-300'>
                  <RiTwitterXLine className='size-6' />
               </a>
            </div>
            <div className='text-sm text-center flex-grow'>
               <span>We ship world wide - Fast and reliable shipping!</span>
            </div>
            <div className='text-sm hidden md:block'>
               <a href="tel:+923166941458" className='hover:text-gray-300'>
                  +923166941458
               </a>
            </div>
         </div>
      </div>
   )
}

export default TopBar
