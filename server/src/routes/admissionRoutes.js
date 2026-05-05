const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", ctrl.getAdmissions);
router.put("/", adminRateLimit, protect, adminOnly, ctrl.updateAdmissions);

module.exports = router;
