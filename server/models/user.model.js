import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, trim: true },
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"]
   },
   password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"]
   },
   role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
   }
}, { timestamps: true })

//Password Hashing
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next()
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
   next()
})

// Match User entered password to Hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("user", userSchema)
export default User