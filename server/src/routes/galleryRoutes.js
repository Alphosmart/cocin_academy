const router = require("express").Router();
const GalleryItem = require("../models/GalleryItem");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { gallerySchema } = require("../validators/schemas");

router.get("/", crud.list(GalleryItem));
router.post("/", adminRateLimit, protect, adminOnly, validate(gallerySchema), crud.create(GalleryItem));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(gallerySchema), crud.update(GalleryItem));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(GalleryItem));

module.exports = router;
