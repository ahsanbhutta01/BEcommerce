import Product from "./models/product.model.js";
import User from "./models/user.model.js";
import Cart from "./models/cart.model.js";
import connectDB from "./config/db.js";
import productData from "./data/products.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();

async function seedData() {
   try {
      await Product.deleteMany();
      await User.deleteMany();
      await Cart.deleteMany();

      const createUser = await User.create({
         name: "Admin Ahsan",
         email: "ahsan@example.com",
         password: "123456",
         role: "admin"
      })

      //Assign the default user ID to each products

      const userId = createUser._id;

      const sampleProducts = productData.map(product => {
         return { ...product, user: userId }
      })

      await Product.insertMany(sampleProducts);
      console.log("Data Imported successfully!");
      process.exit();
   } catch (error) {
      console.log("Error in importing data",error);
      process.exit(1);
   }
}

seedData();