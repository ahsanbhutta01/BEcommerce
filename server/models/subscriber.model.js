import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
   },
   subscribedAt: {
      type: Date,
      default: Date.now
   }
});

const Subscriber = mongoose.model("subscriber", subscriberSchema);

export default Subscriber;
