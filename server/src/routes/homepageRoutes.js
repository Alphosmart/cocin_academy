const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { homepageSchema } = require("../validators/schemas");

router.get("/", ctrl.getHomepage);
router.put("/", adminRateLimit, protect, adminOnly, validate(homepageSchema), ctrl.updateHomepage);

module.exports = router;
