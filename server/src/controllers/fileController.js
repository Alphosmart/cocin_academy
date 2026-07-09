const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const { cloudinary, configured } = require("../config/cloudinary");
const { deleteMediaByUrl, collectMediaUrls } = require("../utils/media");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

// Every model that can hold uploaded media, used to compute which files are
// actually referenced by content (so unused ones can be pruned).
const contentModels = [
  require("../models/BlogPost"),
  require("../models/Event"),
  require("../models/GalleryItem"),
  require("../models/StaffMember"),
  require("../models/Testimonial"),
  require("../models/AcademicProgram"),
  require("../models/HomepageContent"),
  require("../models/PageContent"),
  require("../models/AdmissionContent"),
  require("../models/AdmissionApplication"),
  require("../models/SiteSettings")
];

async function referencedUrls() {
  const used = new Set();
  for (const Model of contentModels) {
    const docs = await Model.find().lean();
    docs.forEach((doc) => collectMediaUrls(doc).forEach((url) => used.add(url)));
  }
  return used;
}

async function listLocalFiles() {
  await fs.mkdir(uploadsDir, { recursive: true });
  const names = await fs.readdir(uploadsDir);
  const files = await Promise.all(
    names.map(async (name) => {
      const stat = await fs.stat(path.join(uploadsDir, name));
      return { id: name, filename: name, size: stat.size, createdAt: stat.birthtime, url: `/uploads/${name}` };
    })
  );
  return files;
}

async function listCloudinaryFiles() {
  const result = await cloudinary.api.resources({ max_results: 200, resource_type: "image" });
  return (result.resources || []).map((r) => ({
    id: r.public_id,
    filename: r.public_id,
    size: r.bytes,
    createdAt: r.created_at,
    url: r.secure_url
  }));
}

// GET /api/files — list uploaded files with a "used" flag.
exports.list = asyncHandler(async (req, res) => {
  const baseUrl = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  const files = configured ? await listCloudinaryFiles() : await listLocalFiles();
  const used = await referencedUrls();

  const withUsage = files.map((file) => {
    const absoluteUrl = file.url.startsWith("http") ? file.url : `${baseUrl}${file.url}`;
    const isUsed = used.has(absoluteUrl) || used.has(file.url);
    return { ...file, url: absoluteUrl, used: isUsed };
  });

  withUsage.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({
    storage: configured ? "cloudinary" : "local",
    total: withUsage.length,
    unused: withUsage.filter((f) => !f.used).length,
    files: withUsage
  });
});

// POST /api/files/delete — body: { urls: [...] }
exports.remove = asyncHandler(async (req, res) => {
  const urls = Array.isArray(req.body.urls) ? req.body.urls.filter(Boolean) : [];
  if (!urls.length) return res.status(400).json({ message: "No files selected" });
  await Promise.all(urls.map(deleteMediaByUrl));
  res.locals.audit = { action: "delete", count: urls.length };
  res.json({ message: `Deleted ${urls.length} file(s)`, count: urls.length });
});
