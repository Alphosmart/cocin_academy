const router = require("express").Router();
const Testimonial = require("../models/Testimonial");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { testimonialSchema } = require("../validators/schemas");

router.get("/", crud.list(Testimonial));
router.post("/", adminRateLimit, protect, adminOnly, validate(testimonialSchema), crud.create(Testimonial));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(testimonialSchema), crud.update(Testimonial));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(Testimonial));

module.exports = router;
