import express from 'express';
import Subscriber from '../models/subscriber.model.js';


const router = express.Router();

router.post('/', async (req, res) => {
   const { email } = req.body;
   if (!email) {
      return res.status(400).json({ msg: "Email is required" });
   }

   try {
      const subscriber = await Subscriber.findOne({ email });
      if(subscriber) {
         return res.status(400).json({ msg: "Email is already subscribed" });
      }

      const newSubscriber = new Subscriber({ email });
      await newSubscriber.save();
      return res.status(201).json({ msg: "Successfully subscribed" });
   } catch (error) {
      return res.status(500).json({ msg: "Internal server error" });
      console.log(error)
   }
})

export default router;
