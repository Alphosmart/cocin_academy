const router = require("express").Router();
const ctrl = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", ctrl.createMessage);
router.get("/", protect, adminOnly, ctrl.listMessages);
router.put("/:id/read", protect, adminOnly, ctrl.markRead);
router.delete("/:id", protect, adminOnly, ctrl.deleteMessage);

module.exports = router;
