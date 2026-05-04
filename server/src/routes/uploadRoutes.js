const router = require("express").Router();
const { upload } = require("../middleware/upload");
const ctrl = require("../controllers/uploadController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", protect, adminOnly, upload.single("image"), ctrl.uploadImage);

module.exports = router;
