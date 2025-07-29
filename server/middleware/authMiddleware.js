import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

async function userProtection(req, res, next) {
   try {
      const tokenn = req.cookies.token;
      if (!tokenn) return res.status(401).json({ msg: "User not authenticated" })

      const decoded = jwt.verify(tokenn, process.env.JWT_SECRET)
      if (!decoded) return res.status(401).json({ msg: "User not authenticated" })

      req.user = await User.findById(decoded.user.id).select('-password')
      next()
   } catch (error) {
      console.log("Token verification failed", error)
      return res.status(401).json({ msg: "Not authorized, token filed" })
   }
}


//Middleware to check if user is admin
function adminProtection(req, res, next) {
   if (req.user && req.user.role === 'admin') {
      next()
   } else {
      return res.status(401).json({ msg: "Not authorized as admin" })
   }
}  

export {userProtection, adminProtection}