import Checkout from "../models/checkout.model.js";

import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

async function createCheckout(req, res) {
   const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

   if (!checkoutItems || !checkoutItems.length === 0) {
      return res.status(400).json({ msg: "No items in checkout" });
   }

   try {
      const newCheckout = await Checkout.create({
         user: req.user._id,
         checkoutItems,
         shippingAddress,
         paymentMethod,
         totalPrice,
         paymentStatus: "Pending",
         isPaid: false
      })
      console.log(`checkout created for user: ${req.user._id}`)
      return res.status(201).json(newCheckout)
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server Error" })
   }
}

async function checkoutPaid(req, res) {
   const { paymentStatus, paymentDetails } = req.body;

   try {
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
         return res.status(404).json({ msg: "Checkout not found" });
      }

      if (paymentStatus === "paid") {
         checkout.isPaid = true;
         checkout.paymentStatus = paymentStatus;
         checkout.paymentDetails = paymentDetails;
         checkout.paidAt = new Date();
         await checkout.save();

         return res.status(200).json({ msg: "Checkout payment successful", checkout });
      } else {
         return res.status(400).json({ msg: "Payment not successful" });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server Error" });
   }
}

async function finalizeCheckout(req, res) {
   try {
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
         return res.status(404).json({ msg: "Checkout not found" });
      }

      if (checkout.isPaid && !checkout.isFinalized) {
         const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            paymentStatus: "paid",
            paymentDetails: checkout.paymentDetails,
         });

         // Mark checkout as finalized to prevent duplicate orders
         checkout.isFinalized = true;
         checkout.finalizedAt = Date.now();
         await checkout.save();

         // Clear the user's cart after finalizing the checkout
         await Cart.findOneAndDelete({ user: checkout.user });
         return res.status(201).json(finalOrder);
      } else if (checkout.isFinalized) {
         return res.status(400).json({ msg: "Checkout already finalized" });
      } else {
         return res.status(400).json({ msg: "Checkout not paid" });
      }

   } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server Error" });
   }
}



export { createCheckout, checkoutPaid, finalizeCheckout }