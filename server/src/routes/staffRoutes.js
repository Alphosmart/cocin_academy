const router = require("express").Router();
const StaffMember = require("../models/StaffMember");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(StaffMember, { sort: "order name" }));
router.post("/", protect, adminOnly, crud.create(StaffMember));
router.put("/:id", protect, adminOnly, crud.update(StaffMember));
router.delete("/:id", protect, adminOnly, crud.remove(StaffMember));

module.exports = router;
