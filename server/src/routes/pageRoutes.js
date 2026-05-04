const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/:slug", ctrl.getPage);
router.put("/:slug", protect, adminOnly, ctrl.updatePage);

module.exports = router;
