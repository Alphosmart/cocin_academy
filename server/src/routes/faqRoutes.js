const router = require("express").Router();
const FAQ = require("../models/FAQ");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", crud.list(FAQ, { sort: "order question" }));
router.post("/", protect, adminOnly, crud.create(FAQ));
router.put("/:id", protect, adminOnly, crud.update(FAQ));
router.delete("/:id", protect, adminOnly, crud.remove(FAQ));

module.exports = router;
