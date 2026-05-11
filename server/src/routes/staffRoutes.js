const router = require("express").Router();
const StaffMember = require("../models/StaffMember");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { staffSchema } = require("../validators/schemas");

router.get("/", crud.list(StaffMember, { sort: "order name" }));
router.post("/", adminRateLimit, protect, adminOnly, validate(staffSchema), crud.create(StaffMember));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(staffSchema), crud.update(StaffMember));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(StaffMember));

module.exports = router;
