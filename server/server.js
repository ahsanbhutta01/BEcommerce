import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import checkoutRoutes from './routes/checkout.routes.js'
import orderRoutes from './routes/orders.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import subscriberRoutes from './routes/subscriber.routes.js'
import adminRoutes from './routes/admin.routes.js'
import { userProtection, adminProtection } from "./middleware/authMiddleware.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const allowedOrigins = process.env.NODE_ENV === 'production'
//    ? [process.env.FRONTEND_URL]
//    : ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);

const allowedOrigins = process.env.NODE_ENV === 'production'
   ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
   : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
   origin: allowedOrigins,
   credentials: true
}));


connectDB();



//API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", userProtection, checkoutRoutes)
app.use("/api/orders", userProtection, orderRoutes)
app.use("/api/upload", userProtection, uploadRoutes);
app.use("/api/subscribe", subscriberRoutes);


// Admin routes
app.use("/api/admin", userProtection, adminProtection, adminRoutes);



app.get("/", (req, res) => res.send("Welcome to BEcom API"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
