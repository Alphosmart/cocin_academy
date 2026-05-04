const SiteSettings = require("../models/SiteSettings");
const HomepageContent = require("../models/HomepageContent");
const AdmissionContent = require("../models/AdmissionContent");
const PageContent = require("../models/PageContent");
const asyncHandler = require("../middleware/asyncHandler");
const { sanitizeObject } = require("../utils/sanitizeHtml");

async function singleton(Model, data = {}) {
  let doc = await Model.findOne();
  if (!doc) doc = await Model.create(data);
  return doc;
}

exports.getSettings = asyncHandler(async (req, res) => res.json(await singleton(SiteSettings)));
exports.updateSettings = asyncHandler(async (req, res) => {
  const existing = await singleton(SiteSettings);
  Object.assign(existing, sanitizeObject(req.body));
  await existing.save();
  res.json(existing);
});

exports.getHomepage = asyncHandler(async (req, res) => res.json(await singleton(HomepageContent)));
exports.updateHomepage = asyncHandler(async (req, res) => {
  const existing = await singleton(HomepageContent);
  Object.assign(existing, sanitizeObject(req.body));
  await existing.save();
  res.json(existing);
});

exports.getAdmissions = asyncHandler(async (req, res) => res.json(await singleton(AdmissionContent)));
exports.updateAdmissions = asyncHandler(async (req, res) => {
  const existing = await singleton(AdmissionContent);
  Object.assign(existing, sanitizeObject(req.body));
  await existing.save();
  res.json(existing);
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
  const doc = await PageContent.findOneAndUpdate(
    { slug: req.params.slug },
    { ...sanitizeObject(req.body), slug: req.params.slug },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(doc);
});
