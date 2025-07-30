import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

async function Registration(req, res) {
   const { name, email, password } = req.body;

   try {
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ msg: "User already exists" })
      user = new User({ name, email, password });
      await user.save();

      const payload = { user: { id: user._id, role: user.role } }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" })

      return res.status(201)
         .cookie(
            "token", token,
            {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
               maxAge: 1000 * 60 * 60 * 40
            }

         )
         .json({
            user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role
            }
         })
   } catch (error) {
      // console.error("Error during registration:", error);
      if (error.name === 'ValidationError') {
         const messages = Object.values(error.errors).map(err => err.message);
         return res.status(400).json({ message: messages.join(', ') });
      };

      return res.status(500).json({ message: "Server error" });
   }
}

async function Login(req, res) {
   const { email, password } = req.body;

   try {
      let user = await User.findOne({ email })
      if (!user) return res.status(400).json({ msg: "Invalid credentials" })

      const isMatch = await user.matchPassword(password)
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

      const payload = { user: { id: user._id, role: user.role } }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" })

      return res.status(201).cookie("token", token, { maxAge: 1000 * 60 * 60 * 40 }).json({
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
         }
      })
   } catch (error) {
      console.log(error)
      res.status(500).send("Server error")
   }
}

async function getUserProfile(req, res) {
   try {

      res.json(req.user)
   } catch (error) {
      console.log(error)
      res.status(500).send("Server error")
   }
}


export { Registration, Login, getUserProfile }