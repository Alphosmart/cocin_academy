const router = require("express").Router();
const Testimonial = require("../models/Testimonial");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(Testimonial));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(Testimonial));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(Testimonial));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(Testimonial));

module.exports = router;
