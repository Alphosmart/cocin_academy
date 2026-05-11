const router = require("express").Router();
const auth = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit, loginRateLimit } = require("../middleware/security");

router.post("/login", loginRateLimit, auth.login);
router.post("/logout", adminRateLimit, auth.logout);
router.get("/me", protect, adminOnly, auth.me);
router.put("/change-password", adminRateLimit, protect, adminOnly, auth.changePassword);

module.exports = router;
