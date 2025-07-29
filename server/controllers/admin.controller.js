import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';


// Controller functions for "Admin" operations on "Users"
async function getAllUsersByAdmin(req, res) {
   try {
      const users = await User.find();
      return res.status(200).json(users);
   } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ msg: "Internal server error" });

   }
}

async function userAddedByAdmin(req, res) {
   try {
      const { name, email, password, role } = req.body;

      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({ msg: "User already exists" });
      }

      const newUser = new User({ name, email, password, role: role || 'customer' });
      await newUser.save();

      return res.status(201).json({ msg: "User added successfully", newUser });
   } catch (error) {
      console.error("Error adding user:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}

async function updateUserByAdmin(req, res) {
   const { name, email, role } = req.body;
   try {
      const user = await User.findById(req.params.id);
      if (user) {
         user.name = name || user.name;
         user.email = email || user.email;
         user.role = role || user.role;
      }
      const updatedUser = await user.save();
      return res.status(200).json({ message: "User updated successfully", updatedUser });
   } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ msg: "Internal server error" });

   }
}

async function deleteUserByAdmin(req, res) {
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).json({ msg: "User not found" });
      }
      await user.deleteOne();
      return res.status(200).json({ msg: "User deleted successfully" });
   } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}



// Controller functions for "Admin" operations on "Products"
async function getAllProductsByAdmin(req, res) {
   try {
      const products = await Product.find();
      return res.status(200).json(products);
   } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}


// Controller functions for "Admin" operations on "Orders"
async function getAllOrdersByAdmin(req, res) {
   try {
      const orders = await Order.find().populate({
         path:"user",
         select: "name email"
      })
      return res.status(200).json(orders);
   } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}

async function updateOrderStatusByAdmin(req, res) {
   const { status } = req.body;
   try {
      const order = await Order.findById(req.params.id).populate("user", "name email");
      if (!order) {
         return res.status(404).json({ msg: "Order not found" });
      }
      order.status = status || order.status;
      order.isDelivered = status === 'Delivered' ? true : order.isDelivered;
      order.deliveredAt = status === 'Delivered' ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      return res.status(200).json({ message: "Order status updated successfully", updatedOrder });
   } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}

async function deleteOrderByAdmin(req, res) {
   try {
      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ msg: "Order not found" });
      }
      await order.deleteOne();
      return res.status(200).json({ msg: "Order removed successfully" });
   } catch (error) {
      console.error("Error removing order:", error);
      return res.status(500).json({ msg: "Internal server error" });
   }
}

export {
   //  exports "Admin" operations on "Users"
   getAllUsersByAdmin, userAddedByAdmin, updateUserByAdmin, deleteUserByAdmin,

   // exports "Admin" operations on "Products"
   getAllProductsByAdmin,

   // exports "Admin" operations on "Orders"
   getAllOrdersByAdmin, updateOrderStatusByAdmin, deleteOrderByAdmin
}
