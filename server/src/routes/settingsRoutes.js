const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", ctrl.getSettings);
router.put("/", adminRateLimit, protect, adminOnly, ctrl.updateSettings);

module.exports = router;
