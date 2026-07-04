const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { cloudinary, configured } = require("../config/cloudinary");

// Per-type size ceilings (bytes). Images are compressed, so keep them small;
// videos need more headroom.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime"
];

function resourceType(file) {
  return file.mimetype.startsWith("video/") ? "video" : "image";
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) return cb(new Error("Only JPG, PNG, WebP, GIF, MP4, WebM, and MOV uploads are allowed"));
    cb(null, true);
  }
});

const extensionByMime = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov"
};

// Enforce the per-type size limit (multer only supports one global limit).
function assertWithinSizeLimit(file) {
  const isVideo = file.mimetype.startsWith("video/");
  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    const error = new Error(`${isVideo ? "Video" : "Image"} exceeds the ${Math.round(max / (1024 * 1024))}MB limit`);
    error.statusCode = 413;
    throw error;
  }
}

// Compress/resize images to web-friendly dimensions before storage. Animated
// GIFs and videos are passed through untouched. Returns { buffer, mimetype, ext }.
async function optimizeImage(file) {
  if (!file.mimetype.startsWith("image/") || file.mimetype === "image/gif") {
    return { buffer: file.buffer, mimetype: file.mimetype, ext: extensionByMime[file.mimetype] };
  }
  try {
    const buffer = await sharp(file.buffer)
      .rotate() // honour EXIF orientation
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    return { buffer, mimetype: "image/jpeg", ext: ".jpg" };
  } catch (error) {
    console.error("Image optimization failed, using original:", error.message);
    return { buffer: file.buffer, mimetype: file.mimetype, ext: extensionByMime[file.mimetype] };
  }
}

async function saveLocalUpload(buffer, ext, mimetype, baseUrl) {
  const uploadsDir = path.join(__dirname, "..", "..", "uploads");
  const filename = `${crypto.randomUUID()}${ext || ".jpg"}`;
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), buffer);
  return { url: `${baseUrl}/uploads/${filename}`, publicId: filename, resourceType: mimetype.startsWith("video/") ? "video" : "image" };
}

async function uploadToCloudinary(file, folder = "school-website", baseUrl = "") {
  assertWithinSizeLimit(file);
  const { buffer, mimetype, ext } = await optimizeImage(file);
  const optimized = { ...file, buffer, mimetype };

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cloudinary must be configured for production uploads");
    }
    return saveLocalUpload(buffer, ext || path.extname(file.originalname), mimetype, baseUrl);
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType(optimized) },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type });
      }
    );
    stream.end(buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
