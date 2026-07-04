const asyncHandler = require("../middleware/asyncHandler");
const { sanitizeObject } = require("../utils/sanitizeHtml");
const { cleanupRemovedMedia } = require("../utils/media");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery(req) {
  const query = {};
  if (req.query.search) {
    const searchTerm = String(req.query.search).trim().slice(0, 80);
    const search = new RegExp(escapeRegex(searchTerm), "i");
    query.$or = [{ title: search }, { name: search }, { category: search }, { excerpt: search }];
  }
  if (req.query.category) query.category = req.query.category;
  if (req.query.status) query.status = req.query.status;
  if (req.query.active === "true") query.isActive = true;
  if (req.query.active === "false") query.isActive = false;

  // Advanced date-range filtering on createdAt.
  const createdAt = {};
  const from = Date.parse(req.query.dateFrom);
  const to = Date.parse(req.query.dateTo);
  if (!Number.isNaN(from)) createdAt.$gte = new Date(from);
  if (!Number.isNaN(to)) {
    // Make the "to" boundary inclusive of the whole day.
    createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
  }
  if (Object.keys(createdAt).length) query.createdAt = createdAt;

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
    res.locals.audit = { resourceId: doc._id, title: doc.title || doc.name };
    res.status(201).json(doc);
  });

exports.update = (Model) =>
  asyncHandler(async (req, res) => {
    const previous = await Model.findById(req.params.id);
    if (!previous) return res.status(404).json({ message: "Content not found" });
    const doc = await Model.findByIdAndUpdate(req.params.id, sanitizeObject(req.body), { new: true, runValidators: true });
    // Remove media files that were replaced or dropped during this update.
    await cleanupRemovedMedia(previous, doc);
    res.locals.audit = { resourceId: doc._id, title: doc.title || doc.name };
    res.json(doc);
  });

exports.remove = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Content not found" });
    // Delete all media that belonged to the removed document.
    await cleanupRemovedMedia(doc, null);
    res.locals.audit = { resourceId: doc._id, title: doc.title || doc.name };
    res.json({ message: "Deleted successfully" });
  });

// PATCH /reorder — body: { items: [{ id, order }, ...] }
exports.reorder = (Model) =>
  asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: "No items to reorder" });
    await Promise.all(
      items
        .filter((item) => item && item.id)
        .map((item) => Model.findByIdAndUpdate(item.id, { order: Number(item.order) || 0 }))
    );
    res.locals.audit = { action: "reorder", count: items.length };
    res.json({ message: "Order updated", count: items.length });
  });

// POST /bulk-delete — body: { ids: [...] }
exports.bulkDelete = (Model) =>
  asyncHandler(async (req, res) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.filter(Boolean) : [];
    if (!ids.length) return res.status(400).json({ message: "No items selected" });
    const docs = await Model.find({ _id: { $in: ids } });
    await Model.deleteMany({ _id: { $in: ids } });
    await Promise.all(docs.map((doc) => cleanupRemovedMedia(doc, null)));
    res.locals.audit = { action: "bulk", count: docs.length };
    res.json({ message: `Deleted ${docs.length} item(s)`, count: docs.length });
  });

// PATCH /bulk-update — body: { ids: [...], update: { isActive?, status? } }
exports.bulkUpdate = (Model) =>
  asyncHandler(async (req, res) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.filter(Boolean) : [];
    if (!ids.length) return res.status(400).json({ message: "No items selected" });
    const allowed = {};
    if (typeof req.body.update?.isActive === "boolean") allowed.isActive = req.body.update.isActive;
    if (typeof req.body.update?.status === "string") allowed.status = req.body.update.status;
    if (typeof req.body.update?.featured === "boolean") allowed.featured = req.body.update.featured;
    if (!Object.keys(allowed).length) return res.status(400).json({ message: "No valid fields to update" });
    const result = await Model.updateMany({ _id: { $in: ids } }, allowed);
    res.locals.audit = { action: "bulk", count: result.modifiedCount };
    res.json({ message: `Updated ${result.modifiedCount} item(s)`, count: result.modifiedCount });
  });
