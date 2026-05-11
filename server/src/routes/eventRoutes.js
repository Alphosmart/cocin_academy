const router = require("express").Router();
const Event = require("../models/Event");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { eventSchema } = require("../validators/schemas");

router.get("/", crud.list(Event, { sort: "date" }));
router.get("/:slug", crud.getBySlug(Event));
router.post("/", adminRateLimit, protect, adminOnly, validate(eventSchema), crud.create(Event));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(eventSchema), crud.update(Event));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(Event));

module.exports = router;
