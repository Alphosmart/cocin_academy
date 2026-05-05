const router = require("express").Router();
const FAQ = require("../models/FAQ");
const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.get("/", crud.list(FAQ, { sort: "order question" }));
router.post("/", adminRateLimit, protect, adminOnly, crud.create(FAQ));
router.put("/:id", adminRateLimit, protect, adminOnly, crud.update(FAQ));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(FAQ));

module.exports = router;
