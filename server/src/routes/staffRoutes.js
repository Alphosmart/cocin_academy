const router = require("express").Router();
const StaffMember = require("../models/StaffMember");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(StaffMember, { sort: "order name" }));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(StaffMember));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(StaffMember));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(StaffMember));

module.exports = router;
