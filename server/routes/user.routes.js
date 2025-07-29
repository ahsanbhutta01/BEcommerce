import express from 'express'
import { Registration, Login, getUserProfile } from '../controllers/user.controller.js'
import { userProtection } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', Registration)
router.post('/login', Login)
router.get('/profile', userProtection, getUserProfile)
router.post('/logout', (req, res) => {
   res.clearCookie('token').json({ message: 'Logged out successfully' });
});

export default router;