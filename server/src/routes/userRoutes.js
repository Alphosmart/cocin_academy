const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

router.use(adminRateLimit, protect, adminOnly);
router.get("/", ctrl.listUsers);
router.post("/", ctrl.createUser);
router.put("/:id", ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;
