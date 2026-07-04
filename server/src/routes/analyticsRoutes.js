const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

// Generous limit — one call per public page view.
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests" }
});

router.post("/track", trackLimiter, ctrl.track);
router.get("/summary", adminRateLimit, protect, adminOnly, ctrl.summary);

module.exports = router;
