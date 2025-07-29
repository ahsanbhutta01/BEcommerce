import express from 'express';
import { createCheckout, checkoutPaid, finalizeCheckout } from '../controllers/checkout.controller.js';

const router = express.Router();


router.post('/', createCheckout)
router.put('/:id/pay', checkoutPaid);
router.post('/:id/finalize', finalizeCheckout);


export default router;