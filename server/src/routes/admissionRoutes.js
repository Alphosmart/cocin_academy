const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", ctrl.getAdmissions);
router.put("/", protect, adminOnly, ctrl.updateAdmissions);

module.exports = router;
