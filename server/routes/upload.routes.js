import express from "express";
import upload from "../middleware/multer.js";
import cloudinary from "../middleware/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
   if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

   try {
      const result = await new Promise((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream((err, result) =>
            err ? reject(err) : resolve(result)
         );
         streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      res.status(200).json({ imageUrl: result.secure_url });
   } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
   }
});

export default router;