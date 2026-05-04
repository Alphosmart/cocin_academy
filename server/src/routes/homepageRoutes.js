const router = require("express").Router();
const ctrl = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", ctrl.getHomepage);
router.put("/", protect, adminOnly, ctrl.updateHomepage);

module.exports = router;
