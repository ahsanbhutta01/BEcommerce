import express from 'express';
import {
   // Imports "Admin" operations on "Users"
   getAllUsersByAdmin, userAddedByAdmin, updateUserByAdmin, deleteUserByAdmin,

   // Imports "Admin" operations on "Products"
   getAllProductsByAdmin,

   // Imports "Admin" operations on "Orders" 
   getAllOrdersByAdmin, updateOrderStatusByAdmin, deleteOrderByAdmin
} from '../controllers/admin.controller.js';


const router = express.Router();

// Routes for "Admin" operations on "Users"
router.get("/users", getAllUsersByAdmin)
router.post("/users", userAddedByAdmin);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);


// Routes for "Admin" operations on "Products"
router.get("/products", getAllProductsByAdmin);

// Routes for "Admin" operations on "Orders"
router.get("/orders", getAllOrdersByAdmin);
router.put("/orders/:id", updateOrderStatusByAdmin);
router.delete("/orders/:id", deleteOrderByAdmin);

export default router;