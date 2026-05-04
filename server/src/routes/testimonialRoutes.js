const router = require("express").Router();
const Testimonial = require("../models/Testimonial");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(Testimonial));
router.post("/", protect, adminOnly, crud.create(Testimonial));
router.put("/:id", protect, adminOnly, crud.update(Testimonial));
router.delete("/:id", protect, adminOnly, crud.remove(Testimonial));

module.exports = router;
