const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { admissionSchema } = require("../validators/schemas");

router.get("/", ctrl.getAdmissions);
router.put("/", adminRateLimit, protect, adminOnly, validate(admissionSchema), ctrl.updateAdmissions);

module.exports = router;
