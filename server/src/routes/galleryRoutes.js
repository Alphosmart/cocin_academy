const router = require("express").Router();
const GalleryItem = require("../models/GalleryItem");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(GalleryItem));
router.post("/", protect, adminOnly, crud.create(GalleryItem));
router.put("/:id", protect, adminOnly, crud.update(GalleryItem));
router.delete("/:id", protect, adminOnly, crud.remove(GalleryItem));

module.exports = router;
