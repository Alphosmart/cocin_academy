const router = require("express").Router();
const AcademicProgram = require("../models/AcademicProgram");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(AcademicProgram, { sort: "order title" }));
router.post("/", protect, adminOnly, crud.create(AcademicProgram));
router.put("/:id", protect, adminOnly, crud.update(AcademicProgram));
router.delete("/:id", protect, adminOnly, crud.remove(AcademicProgram));

module.exports = router;
