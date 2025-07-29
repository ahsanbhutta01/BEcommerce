import express from "express"
import { userProtection, adminProtection } from "../middleware/authMiddleware.js"
import { createProduct, updateProductById, deleteProductById, getAllProducts, getSingleProduct, similarProduct, getHighestRatedProducts, getNewArrivals } from "../controllers/product.controller.js"

const router = express.Router()

router.post('/', userProtection, adminProtection, createProduct)
router.put('/:id', userProtection, adminProtection, updateProductById)
router.delete('/:id', userProtection, adminProtection, deleteProductById)
router.get('/', getAllProducts)
router.get('/best-seller', getHighestRatedProducts)
router.get('/new-arrivals', getNewArrivals)
router.get('/:id', getSingleProduct)
router.get('/similar/:id', similarProduct)


export default router