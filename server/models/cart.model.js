import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
   },
   name: String,
   image: String,
   price: String,
   size: String,
   color: String,
   quantity: {
      type: Number,
      default: 1
   },

}, { _id: false })


const cartSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
   },
   guestId: String,
   products: [cartItemSchema],
   totalPrice: {
      type: Number,
      required: true,
      default: 0
   },

}, { timestamps: true })

export default mongoose.model("cart", cartSchema)