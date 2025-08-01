import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
   },
   name: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   quantity:{
      type: Number,
      required: true
   },
   size:String,
   color: String,
},
{ _id: false }
);

const checkoutSchema = new mongoose.Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false
   },
   checkoutItems: [checkoutItemSchema],
   shippingAddress: {
      address:{type: String, required: true},
      city: {type: String, required: true},
      postalCode: {type: String, required: true},
      country: {type: String, required: true}
   },
   paymentMethod: {
      type: String,
      required: true
   },
   totalPrice: {
      type: Number,
      required: true
   },
   isPaid: {
      type: Boolean,
      default: false
   },
   paidAt: {
      type: Date
   },
   paymentStatus:{
      type: String,
      default: 'pending'
   },
   paymentDetails: {
      type:mongoose.Schema.Types.Mixed, //Store payment details (transaction ID, paypal, etc.)
   },
   isFinalized:{
      type: Boolean,
      default: false
   },
   finalizedAt: {
      type: Date
   }
},{ timestamps: true });

export default mongoose.model("checkout", checkoutSchema);