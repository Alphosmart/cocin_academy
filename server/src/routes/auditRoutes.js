const router = require("express").Router();
const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../middleware/asyncHandler");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

// GET /api/audit-logs?resource=&action=&limit=
router.get(
  "/",
  adminRateLimit,
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.resource) query.resource = req.query.resource;
    if (req.query.action) query.action = req.query.action;
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const logs = await AuditLog.find(query).sort("-createdAt").limit(limit);
    res.json(logs);
  })
);

module.exports = router;
