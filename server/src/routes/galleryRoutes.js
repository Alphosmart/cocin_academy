const router = require("express").Router();
const GalleryItem = require("../models/GalleryItem");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(GalleryItem));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(GalleryItem));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(GalleryItem));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(GalleryItem));

module.exports = router;
