import dotenv from "dotenv";
dotenv.config(); // load env variables immediately

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Log to double-check env
console.log("Cloudinary ENV →",
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on Cloudinary:", response.secure_url);
    fs.unlinkSync(localFilePath); // remove temp file
    return response;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    fs.unlinkSync(localFilePath);
    throw err; // let the controller handle this
  }
};

export { uploadOnCloudinary };
