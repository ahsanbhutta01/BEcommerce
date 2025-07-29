import express from "express";
import { addToCart, updateCartQuantity, deleteFromCart, getCartDetails, mergeCarts } from "../controllers/cart.controller.js";
import {userProtection} from "../middleware/authMiddleware.js"


const router = express.Router();

router.post('/', addToCart)
router.put('/', updateCartQuantity)
router.delete('/', deleteFromCart)
router.get('/', getCartDetails);
router.post('/merge', userProtection, mergeCarts);



export default router
