const router = require("express").Router();
const AcademicProgram = require("../models/AcademicProgram");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(AcademicProgram, { sort: "order title" }));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(AcademicProgram));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(AcademicProgram));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(AcademicProgram));

module.exports = router;
