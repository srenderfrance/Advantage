const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true
});

module.exports = cloudinary;



//cSpell:ignore cloudinary