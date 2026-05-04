const multer = require("multer");
const { cloudinary, configured } = require("../config/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
    cb(null, true);
  }
});

function uploadToCloudinary(file, folder = "school-website") {
  if (!configured) {
    const error = new Error("Cloudinary is not configured");
    error.statusCode = 503;
    throw error;
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(file.buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
