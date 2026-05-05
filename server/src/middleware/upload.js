const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { cloudinary, configured } = require("../config/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) return cb(new Error("Only JPG, PNG, WebP, and GIF uploads are allowed"));
    cb(null, true);
  }
});

const extensionByMime = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

async function saveLocalUpload(file, baseUrl) {
  const uploadsDir = path.join(__dirname, "..", "..", "uploads");
  const filename = `${crypto.randomUUID()}${extensionByMime[file.mimetype] || path.extname(file.originalname) || ".jpg"}`;
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), file.buffer);
  return { url: `${baseUrl}/uploads/${filename}`, publicId: filename };
}

function uploadToCloudinary(file, folder = "school-website", baseUrl = "") {
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cloudinary must be configured for production uploads");
    }
    return saveLocalUpload(file, baseUrl);
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
