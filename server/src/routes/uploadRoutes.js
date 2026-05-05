const router = require("express").Router();
const { upload } = require("../middleware/upload");
const ctrl = require("../controllers/uploadController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.post("/", adminRateLimit, protect, adminOnly, upload.single("image"), ctrl.uploadImage);

module.exports = router;
