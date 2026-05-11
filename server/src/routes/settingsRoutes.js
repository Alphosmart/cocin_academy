const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { settingsSchema } = require("../validators/schemas");

router.get("/", ctrl.getSettings);
router.put("/", adminRateLimit, protect, adminOnly, validate(settingsSchema), ctrl.updateSettings);

module.exports = router;
