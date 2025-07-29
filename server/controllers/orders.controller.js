import Order from "../models/order.model.js";


async function getLoggedUserOrders(req,res){
   try {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
      return res.status(200).json(orders);
   } catch (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ msg: "Internal server error" });
      
   }
}

async function getOrderById(req, res) {
   try {
      const order = await Order.findById(req.params.id).populate("user", "name email");
      if (!order) {
         return res.status(404).json({ msg: "Order not found" });
      }
      return res.status(200).json(order);
   } catch (error) {
      console.error("Error fetching order by ID:", error);
      return res.status(500).json({ msg: "Internal server error" });
      
   }
}


export { getLoggedUserOrders, getOrderById };