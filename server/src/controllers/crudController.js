const asyncHandler = require("../middleware/asyncHandler");
const { sanitizeObject } = require("../utils/sanitizeHtml");

function buildQuery(req) {
  const query = {};
  if (req.query.search) {
    const search = new RegExp(req.query.search, "i");
    query.$or = [{ title: search }, { name: search }, { category: search }, { excerpt: search }];
  }
  if (req.query.category) query.category = req.query.category;
  if (req.query.status) query.status = req.query.status;
  if (req.query.active === "true") query.isActive = true;
  return query;
}

exports.list = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const publicOnly = options.publicFilter?.(req) || {};
    const docs = await Model.find({ ...buildQuery(req), ...publicOnly }).sort(options.sort || "-createdAt");
    res.json(docs);
  });

exports.getBySlug = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findOne({ slug: req.params.slug, ...(options.publicFilter?.(req) || {}) });
    if (!doc) return res.status(404).json({ message: "Content not found" });
    res.json(doc);
  });

exports.create = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(sanitizeObject(req.body));
    res.status(201).json(doc);
  });

exports.update = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, sanitizeObject(req.body), { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: "Content not found" });
    res.json(doc);
  });

exports.remove = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Deleted successfully" });
  });
