const fs = require("fs/promises");
const path = require("path");
const { cloudinary, configured } = require("../config/cloudinary");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

// Fields across the models that hold an uploaded media URL.
const MEDIA_FIELDS = ["image", "featuredImage", "media", "logo", "favicon", "photo"];

function isString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Parse a Cloudinary delivery URL into { publicId, resourceType } for deletion.
// Example: https://res.cloudinary.com/demo/image/upload/v123/school-website/abc.jpg
function parseCloudinaryUrl(url) {
  const match = /res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(.+)$/.exec(url);
  if (!match) return null;
  const resourceType = match[1];
  let rest = match[2].replace(/^v\d+\//, ""); // strip version segment
  rest = rest.replace(/\.[a-zA-Z0-9]+$/, ""); // strip extension
  return { publicId: rest, resourceType };
}

// Extract the local filename from a `/uploads/<file>` URL.
function parseLocalUrl(url) {
  const match = /\/uploads\/([^/?#]+)$/.exec(url);
  return match ? match[1] : null;
}

async function deleteMediaByUrl(url) {
  if (!isString(url)) return;
  try {
    if (url.includes("res.cloudinary.com")) {
      if (!configured) return;
      const parsed = parseCloudinaryUrl(url);
      if (parsed) {
        await cloudinary.uploader.destroy(parsed.publicId, { resource_type: parsed.resourceType });
      }
      return;
    }
    const filename = parseLocalUrl(url);
    if (!filename) return;
    // Guard against path traversal — only delete inside the uploads directory.
    const target = path.join(uploadsDir, path.basename(filename));
    await fs.unlink(target).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  } catch (error) {
    // Never let cleanup failures break the request; just log them.
    console.error(`Media cleanup failed for ${url}:`, error.message);
  }
}

// Collect every media URL referenced anywhere inside a document (including
// nested repeatable arrays such as hero carousel slides / gallery groups).
function collectMediaUrls(value, urls = new Set()) {
  if (!value) return urls;
  if (Array.isArray(value)) {
    value.forEach((item) => collectMediaUrls(item, urls));
    return urls;
  }
  if (typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (MEDIA_FIELDS.includes(key) && isString(entry)) urls.add(entry);
      else if (entry && typeof entry === "object") collectMediaUrls(entry, urls);
    }
  }
  return urls;
}

// Delete media URLs that existed on the old document but are no longer present
// on the next one. Pass no `nextDoc` to delete everything (document removal).
async function cleanupRemovedMedia(previousDoc, nextDoc) {
  if (!previousDoc) return;
  const previous = collectMediaUrls(typeof previousDoc.toObject === "function" ? previousDoc.toObject() : previousDoc);
  const next = nextDoc ? collectMediaUrls(typeof nextDoc.toObject === "function" ? nextDoc.toObject() : nextDoc) : new Set();
  const removed = [...previous].filter((url) => !next.has(url));
  await Promise.all(removed.map(deleteMediaByUrl));
}

module.exports = { deleteMediaByUrl, cleanupRemovedMedia, collectMediaUrls, MEDIA_FIELDS };
