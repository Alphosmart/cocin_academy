const router = require("express").Router();
const AcademicProgram = require("../models/AcademicProgram");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { academicSchema } = require("../validators/schemas");

router.get("/", crud.list(AcademicProgram, { sort: "order title" }));
router.post("/", adminRateLimit, protect, adminOnly, validate(academicSchema), crud.create(AcademicProgram));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(academicSchema), crud.update(AcademicProgram));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(AcademicProgram));

module.exports = router;
