const router = require("express").Router();
const auth = require("../controllers/authController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");
const { adminRateLimit, loginRateLimit } = require("../middleware/security");

router.post("/login", loginRateLimit, auth.login);
router.post("/logout", adminRateLimit, optionalAuth, auth.logout);
router.get("/me", protect, adminOnly, auth.me);
router.put("/change-password", adminRateLimit, protect, adminOnly, auth.changePassword);

// Two-factor management (admin)
router.post("/2fa/setup", adminRateLimit, protect, adminOnly, auth.setupTwoFactor);
router.post("/2fa/enable", adminRateLimit, protect, adminOnly, auth.enableTwoFactor);
router.post("/2fa/disable", adminRateLimit, protect, adminOnly, auth.disableTwoFactor);

module.exports = router;
