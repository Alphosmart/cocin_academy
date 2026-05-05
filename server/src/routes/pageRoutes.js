const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/:slug", ctrl.getPage);
router.put("/:slug", adminRateLimit, protect, adminOnly, ctrl.updatePage);

module.exports = router;
