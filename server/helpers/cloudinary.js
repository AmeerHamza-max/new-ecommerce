const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// ----------------------------
// Cloudinary Configuration
// ----------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dacqh79dn",
  api_key: process.env.CLOUDINARY_KEY || "771634578923789",
  api_secret: process.env.CLOUDINARY_SECRET || "H3O8AvL9O_oGmIXvJ5TpKFYEVPc",
  secure: true,
});

console.log("[Cloudinary] Configuration loaded successfully");

// ----------------------------
// Multer Memory Storage
// ----------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });
console.log("[Multer] Memory storage initialized");

// ----------------------------
// Image Upload Utility
// ----------------------------
async function imageUploadUtils(file) {
  try {
    if (!file) {
      console.warn("[Cloudinary] No file provided for upload");
      throw new Error("No file provided for upload");
    }

    console.log("[Cloudinary] Starting upload for file type:", file.mimetype || "unknown");

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      folder: "products",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    console.log("✅ Cloudinary Upload Successful:", result.secure_url);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    throw new Error("Cloudinary upload failed. Please try again later.");
  }
}

// ----------------------------
// Exports
// ----------------------------
module.exports = { upload, imageUploadUtils };
