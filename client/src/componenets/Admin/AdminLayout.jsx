import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   function toggleSidebar() {
      setIsSidebarOpen(!isSidebarOpen)
   }
   return (
      <div className='min-h-screen flex flex-col md:flex-row relative'>
         {/* Mobile toggle button */}
         <section className="flex md:hidden p-4 bg-gray-900 text-white z-20">
            <button onClick={toggleSidebar}>
               <FaBars size={24} />
               <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
            </button>
         </section>

         {/* Overlay for mobile sidebar */}
         {
            isSidebarOpen && (
               <div className="fixed inset-0 z-10 bg-black/40 md:hidden" onClick={toggleSidebar}></div>
            )
         }

         {/* Sidebar */}
         <section
            className={`bg-gray-900 min-h-screen text-white absolute md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20
         `}
         >
            <AdminSidebar />
         </section>

         {/* Main Content */}
         <section className="flex-grow p-6 overflow-auto ">
            <Outlet/>
         </section>
      </div>
   )
}

export default AdminLayout
