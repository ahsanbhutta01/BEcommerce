import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice'


const UserManagement = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const {user} = useSelector((state) => state.auth)
   const { users, loading, error } = useSelector((state) => state.admin)

   useEffect(()=>{
      if(user && user.role !== 'admin'){
         navigate('/')
      }
   },[user, navigate])

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      role: 'customer' //Default role
   })

   useEffect(()=>{
      if(user && user.role === 'admin'){
         dispatch(fetchUsers())
      }
   },[user, dispatch])

   function handleChange(e) {
      const { name, value } = e.target
      setFormData(prevData => ({ ...prevData, [name]: value }))
   }
   function handleSubmit(e) {
      e.preventDefault()
      dispatch(addUser(formData))
      //Reset after submission
      setFormData({ name: '', email: '', password: '', role: 'customer' })
   }
   function handleRoleChange(userId, newRole) {
      dispatch(updateUser({ id: userId, role: newRole }))
   }
   function handleDeleteUser(userId) {
      if (window.confirm('Are you sure you want to delete this user?')) {
         dispatch(deleteUser(userId))
         toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'
               } w-full max-w-xs bg-red-100 text-red-800 px-4 py-2 rounded shadow flex items-center gap-2`}>
               ⚠️<span>User deleted! "{userId}"</span>
            </div>
         ), { duration: 300 });
      }
   }
   return (
      <div className='max-w-7xl mx-auto p-6'>
         <h2 className='text-2xl font-bold mb-4'>User Management</h2>

         {
            loading && <p>Loading...</p>
         }
         {
            error && <p className='text-red-500'>Error: {error}</p>
         }

         {/* Add New User Form */}
         <section className="p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit}>
               <div className="mb-4">
                  <label className='block text-gray-700'>Name</label>
                  <input
                     type="text"
                     name='name'
                     value={formData.name}
                     onChange={handleChange}
                     className='w-full p-2 border rounded'
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className='block text-gray-700'>Email</label>
                  <input
                     type="email"
                     name='email'
                     value={formData.email}
                     onChange={handleChange}
                     className='w-full p-2 border rounded'
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className='block text-gray-700'>Password</label>
                  <input
                     type="password"
                     name='password'
                     value={formData.password}
                     onChange={handleChange}
                     className='w-full p-2 border rounded'
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className='block text-gray-700'>Role</label>
                  <select
                     name="role"
                     value={formData.role}
                     onChange={handleChange}
                     className='w-full p-2 border rounded cursor-pointer'
                  >
                     <option value="customer">Customer</option>
                     <option value="admin">Admin</option>
                  </select>
               </div>
               <button
                  type='submit'
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'
               >
                  Add User
               </button>
            </form>
         </section>

         <section className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
               <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                     <th className="py-3 px-4">Name</th>
                     <th className="py-3 px-4">Email</th>
                     <th className="py-3 px-4">Role</th>
                     <th className="py-3 px-4">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {
                     users.map((user) => (
                        <tr key={user._id} className='border-b hover:bg-gray-50'>
                           <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                              {user.name}
                           </td>
                           <td className="p-4">{user.email}</td>
                           <td className="p-4">
                              <select
                                 value={user.role}
                                 onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                 className='p-2 border rounded cursor-pointer'
                              >
                                 <option value="customer">Customer</option>
                                 <option value="admin">Admin</option>
                              </select>

                           </td>
                           <td className="p-4">
                              <button
                                 onClick={() => handleDeleteUser(user._id)}
                                 className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer'
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     ))
                  }
               </tbody>
            </table>
         </section>
      </div>
   )
}

export default UserManagement
