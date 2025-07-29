import express from "express";
import { getLoggedUserOrders, getOrderById } from "../controllers/orders.controller.js";


const router = express.Router();


router.get("/my-orders", getLoggedUserOrders)
router.get("/:id", getOrderById);


export default router;