const SiteSettings = require("../models/SiteSettings");
const HomepageContent = require("../models/HomepageContent");
const AdmissionContent = require("../models/AdmissionContent");
const PageContent = require("../models/PageContent");
const asyncHandler = require("../middleware/asyncHandler");
const { sanitizeObject } = require("../utils/sanitizeHtml");
const { cleanupRemovedMedia } = require("../utils/media");

async function singleton(Model, data = {}) {
  let doc = await Model.findOne();
  if (!doc) doc = await Model.create(data);
  return doc;
}

// Save a singleton document, cleaning up any media that the update removes.
async function saveSingleton(existing, body) {
  const before = existing.toObject();
  Object.assign(existing, sanitizeObject(body));
  await existing.save();
  await cleanupRemovedMedia(before, existing);
  return existing;
}

exports.getSettings = asyncHandler(async (req, res) => res.json(await singleton(SiteSettings)));
exports.updateSettings = asyncHandler(async (req, res) => {
  res.json(await saveSingleton(await singleton(SiteSettings), req.body));
});

exports.getHomepage = asyncHandler(async (req, res) => res.json(await singleton(HomepageContent)));
exports.updateHomepage = asyncHandler(async (req, res) => {
  res.json(await saveSingleton(await singleton(HomepageContent), req.body));
});

exports.getAdmissions = asyncHandler(async (req, res) => res.json(await singleton(AdmissionContent)));
exports.updateAdmissions = asyncHandler(async (req, res) => {
  res.json(await saveSingleton(await singleton(AdmissionContent), req.body));
});

exports.getPage = asyncHandler(async (req, res) => {
  let doc = await PageContent.findOne({ slug: req.params.slug });
  if (!doc) {
    doc = await PageContent.create({
      slug: req.params.slug,
      title: req.params.slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      content: ""
    });
  }
  res.json(doc);
});

exports.updatePage = asyncHandler(async (req, res) => {
  const before = await PageContent.findOne({ slug: req.params.slug });
  const doc = await PageContent.findOneAndUpdate(
    { slug: req.params.slug },
    { ...sanitizeObject(req.body), slug: req.params.slug },
    { new: true, upsert: true, runValidators: true }
  );
  await cleanupRemovedMedia(before, doc);
  res.json(doc);
});
