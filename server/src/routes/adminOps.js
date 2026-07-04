const crud = require("../controllers/crudController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");

// Mounts the shared admin operations (reorder + bulk actions) on a resource
// router so every content type gets them without repetition.
module.exports = function mountAdminOps(router, Model) {
  const guard = [adminRateLimit, protect, adminOnly];
  router.patch("/reorder", ...guard, crud.reorder(Model));
  router.post("/bulk-delete", ...guard, crud.bulkDelete(Model));
  router.patch("/bulk-update", ...guard, crud.bulkUpdate(Model));
  return router;
};
