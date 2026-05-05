const router = require("express").Router();
const Event = require("../models/Event");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(Event, { sort: "date" }));
router.get("/:slug", crud.getBySlug(Event));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(Event));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(Event));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(Event));

module.exports = router;
