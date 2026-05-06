const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a generic storage engine that can be used across different routes
const createCloudinaryStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `waste2decor/${folderName}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
      // Optional: transformation: [{ width: 1000, height: 1000, crop: "limit" }]
    }
  });
};

module.exports = {
  cloudinary,
  createCloudinaryStorage
};
