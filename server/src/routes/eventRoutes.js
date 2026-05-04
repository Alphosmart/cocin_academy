const router = require("express").Router();
const Event = require("../models/Event");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(Event, { sort: "date" }));
router.get("/:slug", crud.getBySlug(Event));
router.post("/", protect, adminOnly, crud.create(Event));
router.put("/:id", protect, adminOnly, crud.update(Event));
router.delete("/:id", protect, adminOnly, crud.remove(Event));

module.exports = router;
