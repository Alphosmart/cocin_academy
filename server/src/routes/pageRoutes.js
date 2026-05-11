const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { pageSchema } = require("../validators/schemas");

router.get("/:slug", ctrl.getPage);
router.put("/:slug", adminRateLimit, protect, adminOnly, validate(pageSchema), ctrl.updatePage);

module.exports = router;
