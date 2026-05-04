const rateLimit = require("express-rate-limit");
const router = require("express").Router();
const auth = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 8 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please wait a few minutes and try again." }
});

router.post("/login", authLimiter, auth.login);
router.get("/me", protect, adminOnly, auth.me);
router.put("/change-password", protect, adminOnly, auth.changePassword);

module.exports = router;
