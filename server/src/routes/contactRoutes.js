const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 5 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many contact messages. Please wait a few minutes and try again." }
});

router.post("/", contactLimiter, ctrl.createMessage);
router.get("/", protect, adminOnly, ctrl.listMessages);
router.put("/:id/read", adminRateLimit, protect, adminOnly, ctrl.markRead);
router.delete("/:id", adminRateLimit, protect, adminOnly, ctrl.deleteMessage);

module.exports = router;
