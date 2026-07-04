const router = require("express").Router();
const ctrl = require("../controllers/fileController");
const { protect, adminOnly, developerOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", adminRateLimit, protect, adminOnly, developerOnly, ctrl.list);
router.post("/delete", adminRateLimit, protect, adminOnly, developerOnly, ctrl.remove);

module.exports = router;
